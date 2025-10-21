import { NextRequest, NextResponse } from 'next/server';
import Reserva from '../models/ReservaModel';
import { getUserFromServer } from '../auth';

export default class ReservaController {
  static async list(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const equipamento_id = url.searchParams.get('equipamentoId');
      const start = url.searchParams.get('start');
      const end = url.searchParams.get('end');

      const reservas = await Reserva.findAll({
        equipamento_id: equipamento_id ? Number(equipamento_id) : undefined,
        start: start || undefined,
        end: end || undefined,
      });

      return NextResponse.json(reservas);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const { equipamento_id, usuario_id, inicio, fim } = body;

      if (!equipamento_id || !usuario_id || !inicio || !fim) {
        return NextResponse.json(
          { error: 'equipamento_id, usuario_id, inicio e fim são obrigatórios' },
          { status: 400 },
        );
      }
      // força formato ISO local e evita conversão UTC
      const inicioDate = new Date(inicio.replace(' ', 'T'));
      const fimDate = new Date(fim.replace(' ', 'T'));

      if (fimDate <= inicioDate) {
        return NextResponse.json({ error: 'fim deve ser > início' }, { status: 400 });
      }

      await Reserva.create({
        equipamento_id,
        usuario_id,
        horario_inicio: inicio,
        horario_fim: fim,
      });

      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      const status = message.includes('Conflito') ? 409 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  static async delete(req: NextRequest) {
    try {
      const user = await getUserFromServer();
      if (!user?.supervisor)
        return NextResponse.json({ message: 'Usuário não é supervisor' }, { status: 403 });

      const url = new URL(req.url);
      const equipamento_id = url.searchParams.get('equipamentoId');
      const data = url.searchParams.get('data');

      if (!equipamento_id || !data) {
        return NextResponse.json(
          { error: 'equipamentoId e data são obrigatórios' },
          { status: 400 },
        );
      }

      await Reserva.deleteByEquipamentoEData(Number(equipamento_id), data);
      return NextResponse.json({ ok: true });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}
