import { NextRequest, NextResponse } from 'next/server';
import TokenController from '@/lib/controllers/TokenController';

export async function POST(req: NextRequest) {
  return TokenController.logout();
}
