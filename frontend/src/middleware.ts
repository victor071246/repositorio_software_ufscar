import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();

  // Rota livre para login
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Sem token = manda para login
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Já logado e na home → dashboard
  if (pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Token existe → segue
  try {
    await jwtVerify(token, SECRET);
  } catch {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
