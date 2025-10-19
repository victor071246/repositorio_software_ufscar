import { pool } from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export type IntercorrenciaType = {
  id: number;
  titulo: string;
  descricao: string;
  usuario_id: number;
  criado_em: string;
  equipamento_id: string;
};

class Intercorrencia {
  static async create(data: Partial<IntercorrenciaType>) {
    const { titulo, descricao, usuario_id, equipamento_id } = data;
    const sql = `insert into Intercorrencias (titulo, descricao, usuario_id, equipamento_id) values (?, ?, ?, ?)`;

    const [result] = await pool.query<ResultSetHeader>(sql, [
      titulo,
      descricao,
      usuario_id,
      equipamento_id,
    ]);
    return { id: result.insertId, titulo, descricao, usuario_id, equipamento_id };
  }

  static async delete(id: number): Promise<boolean> {
    const sql = `delete from Intercorrencias where id = ?`;
    const [result] = await pool.query<ResultSetHeader>(sql, [id]);
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<IntercorrenciaType[]> {
    const sql = `select * from Intercorrencias  ORDER BY criado_em DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows as IntercorrenciaType[];
  }

  static async findById(id: number): Promise<IntercorrenciaType | null> {
    const sql = 'select * from Intercorrencias where id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return (rows as IntercorrenciaType[])[0];
  }

  static async findByEquipamentoId(id: number): Promise<IntercorrenciaType[]> {
    const sql = 'SELECT * from Intercorrencias where equipamento_id = ? ORDER BY criado_em DESC';
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows as IntercorrenciaType[];
  }
}

export default Intercorrencia;
