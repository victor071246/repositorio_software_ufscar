import { pool } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export type EquipamentoType = {
  id: number;
  nome: string;
  descricao?: string;
  estado: string;
  departamento_id: number;
};

class Equipamento {
  static async create(data: Partial<EquipamentoType>) {
    const { nome, descricao, estado = 'disponível', departamento_id } = data;
    const sql = ` insert into Equipamentos (nome, descricao, estado, departamento_id) values (?, ?, ?, ?) `;

    const [result] = await pool.query<ResultSetHeader>(sql, [
      nome,
      descricao,
      estado,
      departamento_id,
    ]);
    return { id: result.insertId, nome, descricao, estado, departamento_id };
  }

  static async update(
    id: number,
    {
      nome,
      descricao,
      estado,
      departamento_id,
    }: {
      nome?: string;
      descricao?: string;
      estado?: 'disponível' | 'indisponível';
      departamento_id?: number;
    },
  ): Promise<Equipamento | null> {
    const sql = `update Equipamentos SET nome = ?, descricao = ?, estado = ?, departamento_id = ?
    where id = ?`;

    const [result] = await pool.query<ResultSetHeader>(sql, [
      nome,
      descricao,
      estado,
      departamento_id,
      id,
    ]);

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const sql = `delete from Equipamentos where id = ?`;
    const [result] = await pool.query<ResultSetHeader>(sql, [id]);
    return result.affectedRows > 0;
  }

  static async findAll(filters?: {
    nome?: string;
    estado?: 'disponível' | 'indisponível';
    departamento_id?: number;
  }): Promise<EquipamentoType[]> {
    let sql = 'select * from Equipamentos';
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (filters?.nome) {
      whereClauses.push('LOWER(nome) LIKE LOWER(?)');
      params.push(`%${filters.nome}%`);
    }
    if (filters?.estado) {
      whereClauses.push('LOWER(estado) = LOWER(?)');
      params.push(filters.estado);
    }
    if (filters?.departamento_id) {
      whereClauses.push('departamento_id = ?');
      params.push(filters.departamento_id);
    }
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ' ORDER BY nome ASC';
    const [rows] = await pool.query(sql, params);
    return rows as EquipamentoType[];
  }

  static async findById(id: number): Promise<EquipamentoType | null> {
    const sql = 'select * from Equipamentos where id = ?';
    const [rows] = await pool.query(sql, [id]);
    return (rows as EquipamentoType[])[0] || null;
  }
}

export default Equipamento;
