import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';


export async function GET() {
try {
const [rows] = await pool.query(
`SELECT id, nome, descricao, estado, departamento_id, criado_em
FROM Equipamentos
ORDER BY nome ASC`
);
return NextResponse.json(rows);
} catch (e:any) {
return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
}
}