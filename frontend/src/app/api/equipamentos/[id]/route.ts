import { NextRequest } from 'next/server';
import EquipamentoController from '@/lib/controllers/EquipamentoController';

// ✅ GET por ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // aguarda params
  return EquipamentoController.getById(req, id);
}

// ✅ PUT (atualizar equipamento)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // idem
  return EquipamentoController.update(req, id);
}
