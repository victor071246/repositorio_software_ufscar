import { NextRequest } from 'next/server';
import ReservaController from '@/lib/controllers/ReservaController';

export async function GET(req: NextRequest) {
  return ReservaController.list(req);
}

export async function POST(req: NextRequest) {
  return ReservaController.create(req);
}

export async function DELETE(req: NextRequest) {
  return ReservaController.delete(req);
}
