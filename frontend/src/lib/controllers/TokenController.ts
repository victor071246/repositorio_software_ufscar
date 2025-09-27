import { NextRequest, NextResponse } from 'next/server';
import Usuario from '../models/UsuarioModel';
import { SignJWT } from 'jose';

class TokenCotroller {
  async post(req: NextRequest) {
    try {
      const body = await req.json();
      const { usuario, senha } = body;

      if (!usuario || !senha) {
        return NextResponse.json({ message: 'Usuário e senha são obrigatórios' }, { status: 400 });
      }

      const user = await Usuario.findByUsername(usuario);
      if (!user) {
        return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 400 });
      }

      const senhaValida = await Usuario.comparePassword(senha, user.senha_hash);
      if (!senhaValida) {
        return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
      }

      const payload = {
        id: user.id,
        usuario: user.usuario,
        admin: user.admin,
        supervisor: user.supervisor,
      };

      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
      if (!secret) throw new Error('TOKEN_SECRET não definido');
      const expiresInSeconds = 60 * 60 * 24 * 90;
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(`${expiresInSeconds}s`)
        .sign(secret);

      const response = NextResponse.json(
        { message: 'Login realizado' },
        {
          status: 200,
        },
      );

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresInSeconds,
        path: '/',
      });

      return response;
    } catch (e) {
      console.error(e);
      return NextResponse.json({ message: 'Erro ao fazer login' }, { status: 500 });
    }
  }
}
export default new TokenCotroller();
