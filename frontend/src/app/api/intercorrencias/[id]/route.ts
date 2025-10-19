import { NextRequest } from 'next/server';
import IntercorrenciaController from '@/lib/controllers/InterCorrenciaController';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  return IntercorrenciaController.findByEquipamentId(req, id);
}
