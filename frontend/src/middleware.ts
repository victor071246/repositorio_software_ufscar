import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === 'pages/login') {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();
  if (token) {
    const { payload } = await jwtVerify(token, SECRET);

    if (payload) {
      console.log(payload);
      console.log('token_logado');
      // const user_id = payload.id;
      // const username = payload.usuario;
      // const admin = payload.admin;
      // const supervisor = payload.supervisor;
    }
  }
  if (req.nextUrl.pathname === '/' && token) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  if (req.nextUrl.pathname !== '/pages/login' && !token) {
    url.pathname = '/pages/login';
    console.log('token_não_logado');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
