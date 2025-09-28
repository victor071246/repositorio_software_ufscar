import { NextRequest } from 'next/server';
import EquipamentoController from '@/lib/controllers/EquipamentoController';

export async function GET(req: NextRequest) {
  return EquipamentoController.list(req);
}

export async function POST(req: NextRequest) {
  return EquipamentoController.create(req);
}
