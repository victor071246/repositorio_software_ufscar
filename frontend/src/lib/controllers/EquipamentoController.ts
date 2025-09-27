import { NextRequest, NextResponse } from 'next/server';
import Equipamento, { EquipamentoType } from '../models/EquipamentoModel';
import { error } from 'console';

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
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

export default EquipamentoController;
