import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export type ReservaType = {
  id?: number;
  equipamento_id: number;
  usuario_id: number;
  horario_inicio: string;
  horario_fim: string;
};

export type ReservaRow = ReservaType & {
  responsavel: string;
  equipamento_nome: string;
};

export default class Reserva {
  static async findAll(filtros: {
    equipamento_id?: number;
    start?: string;
    end?: string;
  }): Promise<ReservaRow[]> {
    const where: string[] = [];
    const params: (string | number)[] = [];

    if (filtros.equipamento_id) {
      where.push('a.equipamento_id = ?');
      params.push(filtros.equipamento_id);
    }
    if (filtros.start) {
      where.push('a.horario_fim >= ?');
      params.push(`${filtros.start} 00:00:00`);
    }
    if (filtros.end) {
      where.push('a.horario_inicio <= ?');
      params.push(`${filtros.end} 23:59:59`);
    }

    const sql = `
      SELECT a.id, a.equipamento_id, a.usuario_id, a.horario_inicio, a.horario_fim,
             u.usuario AS responsavel, e.nome AS equipamento_nome
      FROM Agendamentos a
      JOIN Usuarios u     ON u.id = a.usuario_id
      JOIN Equipamentos e ON e.id = a.equipamento_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY a.horario_inicio ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as ReservaRow[];
  }

  static async create(reserva: ReservaType): Promise<void> {
    const { equipamento_id, usuario_id, horario_inicio, horario_fim } = reserva;

    const [conf] = await pool.query<RowDataPacket[]>(
      `SELECT 1 FROM Agendamentos
       WHERE equipamento_id = ?
         AND horario_inicio < ?
         AND horario_fim > ?
       LIMIT 1`,
      [equipamento_id, horario_fim, horario_inicio],
    );

    if (conf.length) throw new Error('Conflito de agendamento para este equipamento.');

    await pool.query<ResultSetHeader>(
      `INSERT INTO Agendamentos (equipamento_id, usuario_id, horario_inicio, horario_fim)
       VALUES (?, ?, ?, ?)`,
      [equipamento_id, usuario_id, horario_inicio, horario_fim],
    );
  }

  static async deleteByEquipamentoEData(equipamento_id: number, data: string): Promise<void> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      throw new Error('Formato de data inválido');
    }
    await pool.query(
      `DELETE FROM Agendamentos
   WHERE equipamento_id = ?
     AND horario_inicio LIKE CONCAT(?, '%')`,
      [equipamento_id, data], // data = '2025-09-22'
    );
  }
}
