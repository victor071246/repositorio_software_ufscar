import { NextRequest, NextResponse } from 'next/server';
import Intercorrencia from '../models/InterCorrenciaModel';
import { getUserFromServer } from '../auth';
import Usuario from '../models/UsuarioModel';

class IntercorrenciaController {
  static async create(req: NextRequest) {
    try {
      const { equipamento_id, titulo, descricao } = await req.json();

      if (!titulo || !descricao) {
        return NextResponse.json(
          { error: "'Título' e 'Descrição são obrigatórios'" },
          { status: 400 },
        );
      }
      const usuario = await getUserFromServer();
      const usuario_id = usuario!.id;

      const novaIntercorrencia = await Intercorrencia.create({
        titulo,
        descricao,
        usuario_id,
        equipamento_id,
      });

      const intercorrenciaCriada = await Intercorrencia.findById(novaIntercorrencia.id);

      return NextResponse.json(intercorrenciaCriada, { status: 201 });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async delete(req: NextRequest) {
    try {
      const user = await getUserFromServer();
      const { id } = await req.json();

      if (!id) {
        return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
      }
      if (user?.admin === false) {
        return NextResponse.json({ error: 'Usuário não autorizado' }, { status: 403 });
      }

      await Intercorrencia.delete(id);
      return NextResponse.json({ message: 'Intercorrência deletada com sucesso' }, { status: 200 });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async findByEquipamentId(req: NextRequest, equipamento_id: number) {
    const intercorrencias = await Intercorrencia.findByEquipamentoId(equipamento_id);

    const comUsuarios = await Promise.all(
      intercorrencias.map(async (intercorrencia) => {
        const usuario = await Usuario.findById(intercorrencia.usuario_id);
        console.log(usuario?.nome);

        return {
          ...intercorrencia,
          usuario_nome: usuario?.usuario || 'Usuário desconhecido',
        };
      }),
    );

    return NextResponse.json(comUsuarios);
  }
}

export default IntercorrenciaController;
