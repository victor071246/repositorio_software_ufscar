import { NextRequest, NextResponse } from 'next/server';
import Equipamento from '../models/EquipamentoModel';

class EquipamentoController {
  static async create(req: NextRequest) {
    try {
      const { nome, descricao, estado} = await req.json();

      if (!nome ) {
        return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
      }

      const novoEquipamento = await Equipamento.create({
        nome,
        descricao,
        estado,
      });

      return NextResponse.json(novoEquipamento, { status: 201 });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

static async list(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const equipamentoId = url.searchParams.get('equipamentoId');
    const nome = url.searchParams.get('nome');
    const estado = url.searchParams.get('estado');

    // 🔹 Caso venha um equipamentoId, retorna só esse equipamento
    if (equipamentoId) {
      const equipamento = await Equipamento.findById(Number(equipamentoId));
      if (!equipamento)
        return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });
      return NextResponse.json([equipamento]); // mantém compatibilidade com o front atual
    }

    // 🔹 Caso contrário, lista todos
    const filtros: { nome?: string; estado?: 'disponível' | 'indisponível' } = {};
    if (nome) filtros.nome = nome;
if (estado === 'disponível' || estado === 'indisponível') {
  filtros.estado = estado;
}


    const equipamentos = await Equipamento.findAll(filtros);
    return NextResponse.json(equipamentos, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

static async getById(req: NextRequest, idParam: string) {
  try {
    const id = Number(idParam);
    const equipamento = await Equipamento.findById(id);

    if (!equipamento)
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });

    return NextResponse.json(equipamento, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


  static async update(req: NextRequest, idParam: string) {
    try {
      const id = Number(idParam);
      const { nome, descricao, estado } = await req.json();

      const updated = await Equipamento.update(id, { nome, descricao, estado });

      if (!updated)
        return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 });

      return NextResponse.json(updated);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

export default EquipamentoController;
