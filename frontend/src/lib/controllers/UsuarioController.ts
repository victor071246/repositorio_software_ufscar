import { NextRequest, NextResponse } from 'next/server';
import Usuario from '../models/UsuarioModel';
import { getUserFromServer } from '../auth';

class UsuarioController {
  static async create(req: NextRequest) {
    try {
      const user = await getUserFromServer();

      if (!user!.admin && !user!.supervisor) {
        return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
      }

      const {
        usuario,
        nome,
        senha,
        admin = false,
        supervisor = false,
        departamento,
      } = await req.json();

      if (!usuario || !senha) {
        return NextResponse.json(
          {
            error: 'Usuário e senha são obrigatórios',
          },
          {
            status: 400,
          },
        );
      }

      const novoUsuario = await Usuario.create({
        usuario,
        nome,
        senha,
        admin,
        departamento,
        supervisor,
        criador: user!.id,
      });

      return NextResponse.json(novoUsuario, { status: 201 });
    } catch (e: unknown) {
      console.error(e);

      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  static async list(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const search = url.searchParams.get('search') || '';
      const usuarios = await Usuario.findAll({ search });
      return NextResponse.json(usuarios);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async getById(req: NextRequest, id: number) {
    try {
      const usuario = await Usuario.findById(id);
      if (!usuario) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      return NextResponse.json(usuario);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  static async resetSenha(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const loggedUser = await getUserFromServer();
      if (!loggedUser) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }

      const targetUserId = Number(params.id);
      const targetUser = await Usuario.findById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      // Pegamos só os campos relevantes do usuário logado
      const minimal = {
        admin: loggedUser.admin,
        supervisor: loggedUser.supervisor,
      };

      // Validação usando o model
      if (!Usuario.canResetSenha(minimal, targetUser)) {
        return NextResponse.json(
          { error: 'Sem permissão para resetar esta senha' },
          { status: 403 },
        );
      }

      await Usuario.resetSenha(targetUserId);

      return NextResponse.json({ message: 'Senha resetada para: 123456' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro interno';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}

export default UsuarioController;
