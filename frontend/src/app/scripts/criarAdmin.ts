import dotenv from 'dotenv';
import { pool } from '../../lib/db';
dotenv.config();
import bcrypt from 'bcrypt';

async function criarAdmin() {
  try {
    const usuario = 'admin';
    const senha = process.env.ADMIN_PASSWORD!;
    const supervisor = true;
    const admin = true;
    const departamento_id = 1;

    const saltRounds = 10;

    if (!senha) throw new Error('ADMIN_PASSWORD não está definida no .env');

    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const sql = `
        insert into Usuarios (usuario, senha_hash, supervisor, admin, departamento_id)
        values (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      usuario,
      senha_hash,
      supervisor,
      admin,
      departamento_id,
    ]);
    console.log('Usuário admin criado com sucesso: ', result);
  } catch (error) {
    console.error('Erro ao criar usuário administrador: ', error);
  } finally {
    await pool.end();
  }
}

criarAdmin();
