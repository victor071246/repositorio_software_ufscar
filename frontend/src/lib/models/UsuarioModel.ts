import { pool } from '../db';
import bcrypt from 'bcrypt';

export type UsuarioType = {
  id: number;
  usuario: string;
  email?: string;
  senha_hash: string;
  admin: boolean;
  supervisor: boolean;
};

class Usuario {
  static async findByUsername(usuario: string): Promise<UsuarioType | null> {
    const [rows] = await pool.query('select * from Usuarios where usuario =?', [usuario]);
    return (rows as UsuarioType[])[0] || null;
  }

  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }
}

export default Usuario;
