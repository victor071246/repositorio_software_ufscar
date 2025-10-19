import { NextRequest, NextResponse } from 'next/server';
import Equipamento from '../models/EquipamentoModel';

class EquipamentoController {
  static async create(req: NextRequest) {
    try {
      const { nome, descricao, estado, departamento_id } = await req.json();

      if (!nome || !departamento_id) {
        return NextResponse.json({ error: 'Nome e departamento obrigatórios' }, { status: 400 });
      }

      const novoEquipamento = await Equipamento.create({
        nome,
        descricao,
        estado,
        departamento_id,
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
      const params = Object.fromEntries(url.searchParams);
      const { nome, estado, departamento_id } = params;

      const filtros: {
        nome?: string;
        estado?: 'disponível' | 'indisponível';
        departamento_id?: number;
      } = {};

      if (nome) filtros.nome = nome;
      if (estado === 'disponível' || estado === 'indisponível') filtros.estado = estado;
      if (departamento_id) filtros.departamento_id = Number(departamento_id);

      const equipamentos = await Equipamento.findAll(filtros);

      return NextResponse.json(equipamentos);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  static async update(req: NextRequest, idParam: string) {
    try {
      const id = Number(idParam);
      const { nome, descricao, estado, departamento_id } = await req.json();

      const updated = await Equipamento.update(id, { nome, descricao, estado, departamento_id });

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
