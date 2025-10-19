import { NextRequest, NextResponse } from 'next/server';
import IntercorrenciaController from '@/lib/controllers/InterCorrenciaController';

export async function POST(req: NextRequest) {
  return IntercorrenciaController.create(req);
}

export async function DELETE(req: NextRequest) {
  return IntercorrenciaController.delete(req);
}
