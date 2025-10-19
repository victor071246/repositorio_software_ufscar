import { pool } from '../db';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export type UsuarioType = {
  id: number;
  usuario: string;
  nome: string;
  email?: string;
  senha_hash: string;
  admin: boolean;
  supervisor: boolean;
  departamento: string;
  criador?: number;
};

// Apenas os campos que precisamos para validação
export type LoggedUserMinimal = {
  admin: boolean;
  supervisor: boolean;
};

class Usuario {
  static async findByUsername(usuario: string): Promise<UsuarioType | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM Usuarios WHERE usuario = ?', [
      usuario,
    ]);
    return (rows as UsuarioType[])[0] || null;
  }

  static async findById(id: number): Promise<UsuarioType | null> {
    const [rows] = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
    return (rows as UsuarioType[])[0] || null;
  }

  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  static async findAll({ search }: { search?: string }): Promise<UsuarioType[]> {
    let sql = 'SELECT * FROM Usuarios';
    const params: (string | undefined)[] = [];

    if (search) {
      sql += ' WHERE usuario LIKE ? OR nome LIKE ? OR departamento LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as UsuarioType[];
  }

  static async create({
    usuario,
    nome,
    senha,
    admin = false,
    supervisor = false,
    departamento,
    criador,
  }: {
    usuario: string;
    nome: string;
    senha: string;
    admin?: boolean;
    supervisor?: boolean;
    departamento: string;
    criador?: number;
  }): Promise<UsuarioType> {
    const senha_hash = await bcrypt.hash(senha, 10);
    const sql = `
      INSERT INTO Usuarios (usuario, nome, senha_hash, admin, supervisor, departamento, criador)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(sql, [
      usuario,
      nome,
      senha_hash,
      admin ? 1 : 0,
      supervisor ? 1 : 0,
      departamento,
      criador ?? null,
    ]);

    return {
      id: result.insertId,
      nome,
      usuario,
      senha_hash,
      admin,
      supervisor,
      departamento,
      criador,
    };
  }

  // Reset de senha
  static async resetSenha(id: number, novaSenha: string = '123456'): Promise<void> {
    const senha_hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE Usuarios SET senha_hash = ? WHERE id = ?', [senha_hash, id]);
  }

  // Muda a senha antiga para a senha nova
  static async mudarSenhaAntigaSenhaNova(id: number, senha_antiga: string): Promise<void> {
    const senha_hash = await bcrypt.hash(senha_antiga, 10);
    await pool.query('UPDATE Usuarios SET senha_hash = ? WHERE id = ?', [senha_hash, id]);
  }

  // Validação de permissão
  static canResetSenha(
    loggedUser: { admin: boolean; supervisor: boolean },
    targetUser: UsuarioType,
  ): boolean {
    if (loggedUser.admin) return true; // admin pode todos
    if (loggedUser.supervisor && !targetUser.admin && !targetUser.supervisor) return true; // supervisor só de usuários normais
    return false; // usuário comum não pode
  }
}

export default Usuario;
