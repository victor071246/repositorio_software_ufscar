import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();

  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET);
        console.log(payload);
        console.log('token_logado');
        // const user_id = payload.id;
        // const username = payload.usuario;
        // const admin = payload.admin;
        // const supervisor = payload.supervisor;

        url.pathname = '/pages/dashboard';
      } catch (e) {
        url.pathname = '/pages/login';
      }
    } else {
      url.pathname = '/login';
      console.log('token_não_logado');
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
