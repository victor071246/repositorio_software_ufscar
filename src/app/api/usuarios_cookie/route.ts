import { NextRequest, NextResponse } from 'next/server';
import { getUserFromServer } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
