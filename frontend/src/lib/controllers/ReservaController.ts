import { NextRequest, NextResponse } from 'next/server';
import Reserva from '../models/ReservaModel';
import { getUserFromServer } from '../auth';

export default class ReservaController {
  // 🔹 LISTAR RESERVAS
  static async list(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const equipamento_id = url.searchParams.get('equipamentoId');
      const start = url.searchParams.get('start');
      const end = url.searchParams.get('end');

      const filtros = {
        equipamento_id: equipamento_id ? Number(equipamento_id) : undefined,
        start: start || undefined,
        end: end || undefined,
      };

      const reservas = await Reserva.findAll(filtros);
      return NextResponse.json(reservas, { status: 200 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // 🔹 CRIAR RESERVA (sem erro de hora)
static async create(req: NextRequest) {
  try {
    const body = await req.json();
    const { equipamento_id, usuario_id, inicio, fim } = body;

    if (!equipamento_id || !usuario_id || !inicio || !fim) {
      return NextResponse.json(
        { error: 'equipamento_id, usuario_id, inicio e fim são obrigatórios' },
        { status: 400 }
      );
    }

    // 🧩 Função que quebra "YYYY-MM-DD HH:mm:ss" em partes numéricas
    function parseDateTime(datetimeStr: string) {
      const [datePart, timePart] = datetimeStr.split(' ');
      if (!datePart || !timePart)
        throw new Error(`Formato inválido: ${datetimeStr}`);

      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      return { year, month, day, hour, minute, second };
    }

    const ini = parseDateTime(inicio);
    const fimParts = parseDateTime(fim);

    console.log('🕒 Início:', ini);
    console.log('🕒 Fim:', fimParts);

    // 🔹 Cria valores numéricos pra comparar (ano, mês, dia, hora)
    const startKey = ini.year * 100000000 + ini.month * 1000000 + ini.day * 10000 + ini.hour * 100 + ini.minute;
    const endKey = fimParts.year * 100000000 + fimParts.month * 1000000 + fimParts.day * 10000 + fimParts.hour * 100 + fimParts.minute;

    if (endKey <= startKey) {
      console.error('❌ Horário final menor ou igual ao inicial.');
      return NextResponse.json(
        { error: 'O horário final deve ser maior que o inicial' },
        { status: 400 }
      );
    }

    // ✅ Tudo certo, cria a reserva
    await Reserva.create({
      equipamento_id,
      usuario_id,
      horario_inicio: inicio,
      horario_fim: fim,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    const message = e.message || 'Erro interno';
    const status = message.includes('Conflito') ? 409 : 500;
    console.error('❌ Erro em ReservaController.create:', message);
    return NextResponse.json({ error: message }, { status });
  }
}


  // 🔹 DELETAR RESERVAS POR DIA
  static async delete(req: NextRequest) {
    try {
      const user = await getUserFromServer();
      if (!user?.supervisor)
        return NextResponse.json({ error: 'Usuário não é supervisor' }, { status: 403 });

      const url = new URL(req.url);
      const equipamento_id = url.searchParams.get('equipamentoId');
      const data = url.searchParams.get('data');

      if (!equipamento_id || !data) {
        return NextResponse.json(
          { error: 'equipamentoId e data são obrigatórios' },
          { status: 400 }
        );
      }

      await Reserva.deleteByEquipamentoEData(Number(equipamento_id), data);
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
