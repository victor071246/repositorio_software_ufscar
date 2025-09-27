import { pool } from '../db';
import bcrypt from 'bcrypt';
import { ResultSetHeader } from 'mysql2';

export type UsuarioType = {
  id: number;
  usuario: string;
  email?: string;
  senha_hash: string;
  admin: boolean;
  supervisor: boolean;
  criador?: number;
};

class Usuario {
  static async findByUsername(usuario: string): Promise<UsuarioType | null> {
    const [rows] = await pool.query('select * from Usuarios where usuario =?', [usuario]);
    return (rows as UsuarioType[])[0] || null;
  }

  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  static async create({
    usuario,
    senha,
    admin = false,
    supervisor = false,
    criador,
  }: {
    usuario: string;
    senha: string;
    admin?: boolean;
    supervisor?: boolean;
    criador?: number;
  }): Promise<UsuarioType> {
    const senha_hash = await bcrypt.hash(senha, 10);
    const sql = `insert into Usuarios (usuario, senha_hash, admin, supervisor, criador)
    values (?, ?, ?, ?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(sql, [
      usuario,
      senha_hash,
      admin ? 1 : 0,
      supervisor ? 1 : 0,
      criador || null,
    ]);

    return {
      id: result.insertId,
      usuario,
      admin,
      senha_hash,
      supervisor,
      criador,
    };
  }
}

export default Usuario;
