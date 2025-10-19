import { NextRequest } from 'next/server';
import UsuarioController from '@/lib/controllers/UsuarioController';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  return UsuarioController.getById(req, id);
}
