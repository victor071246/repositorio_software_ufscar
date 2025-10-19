import { NextRequest } from 'next/server';
import UsuarioController from '@/lib/controllers/UsuarioController';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  return UsuarioController.resetSenha(req, context);
}
