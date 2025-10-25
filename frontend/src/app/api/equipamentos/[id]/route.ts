import { NextRequest } from 'next/server';
import EquipamentoController from '@/lib/controllers/EquipamentoController';

export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  return EquipamentoController.update(req, id);
}

export async function GET(req: NextRequest) {
  return EquipamentoController.list(req);
}
