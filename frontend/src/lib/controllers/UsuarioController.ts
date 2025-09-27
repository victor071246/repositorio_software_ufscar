import { NextRequest, NextResponse } from 'next/server';
import Usuario from '../models/UsuarioModel';
import { getUserFromRequest } from '../auth';

class UsuarioController {
  static async create(req: NextRequest) {
    try {
      const user = await getUserFromRequest(req);

      if (!user!.admin && !user!.supervisor) {
        return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
      }

      const { usuario, senha, admin = false, supervisor = false } = await req.json();

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
        senha,
        admin,
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
}

export default new UsuarioController();
