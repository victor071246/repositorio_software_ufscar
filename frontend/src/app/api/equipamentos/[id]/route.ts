import { NextRequest } from 'next/server';
import EquipamentoController from '@/lib/controllers/EquipamentoController';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // se quiser pegar por id
  return EquipamentoController.list(req); // ou criar findById
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return EquipamentoController.update(req, params.id);
}
