import { NextRequest, NextResponse } from 'next/server';
import UsuarioController from '@/lib/controllers/UsuarioController';

export async function GET(req: NextRequest) {
  return UsuarioController.list(req);
}

export async function POST(req: NextRequest) {
  return UsuarioController.create(req);
}
