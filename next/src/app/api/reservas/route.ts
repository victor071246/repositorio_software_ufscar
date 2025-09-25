import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/** Lista reservas com filtros equipamentoId, start, end (YYYY-MM-DD) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const equipamentoId = url.searchParams.get('equipamentoId');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    const where: string[] = [];
    const params: any[] = [];

    if (equipamentoId) { where.push('a.equipamento_id = ?'); params.push(Number(equipamentoId)); }
    if (start)         { where.push('a.horario_fim >= ?');   params.push(`${start} 00:00:00`); }
    if (end)           { where.push('a.horario_inicio <= ?');params.push(`${end} 23:59:59`); }

    const sql = `
      SELECT a.id, a.equipamento_id, a.usuario_id, a.horario_inicio, a.horario_fim,
             u.usuario AS responsavel, e.nome AS equipamento_nome
      FROM Agendamentos a
      JOIN Usuarios u     ON u.id = a.usuario_id
      JOIN Equipamentos e ON e.id = a.equipamento_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY a.horario_inicio ASC
    `;
    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (e:any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

/** Cria nova reserva com checagem de conflito */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { equipamento_id, usuario_id, inicio, fim } = body || {};

    if (!equipamento_id || !usuario_id || !inicio || !fim) {
      return NextResponse.json(
        { error: 'equipamento_id, usuario_id, inicio, fim são obrigatórios' },
        { status: 400 }
      );
    }
    if (new Date(fim) <= new Date(inicio)) {
      return NextResponse.json({ error: 'fim deve ser > início' }, { status: 400 });
    }

    // Conflito: interseção de intervalos no mesmo equipamento
    const [conf] = await pool.query(
      `SELECT 1 FROM Agendamentos
       WHERE equipamento_id = ?
         AND horario_inicio < ?
         AND horario_fim > ?
       LIMIT 1`,
      [equipamento_id, fim, inicio]
    );
    // @ts-ignore
    if (conf.length) {
      return NextResponse.json({ error: 'Conflito de agendamento para este equipamento.' }, { status: 409 });
    }

    await pool.query(
      `INSERT INTO Agendamentos (equipamento_id, usuario_id, horario_inicio, horario_fim)
       VALUES (?, ?, ?, ?)`,
      [equipamento_id, usuario_id, inicio, fim]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
