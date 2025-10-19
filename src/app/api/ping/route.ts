import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';


export async function GET() {
try {
const [rows] = await pool.query('SELECT 1 AS ok');
// @ts-ignore
return NextResponse.json({ ok: rows[0]?.ok === 1 });
} catch (e:any) {
return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status: 500 });
}
}