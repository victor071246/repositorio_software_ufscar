import connection from '../database/connection';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const Usuario = {
  async create({ nome, email, senha, supervisor = false, departamento_id, admin = false }) {
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const sql =
      'insert into usuarios (nome, email, senha_hash, supervisor, admin, departamento_id) values (?, ?, ?, ?, ?)';
    const params = [nome, email, senha_hash, supervisor, admin, departamento_id];

    const [result] = await connection.execute(sql, params);
    return this.findById(result.insertId);
  },

  async update(id, { nome, email, senha, supervisor, departamento_id }) {
    let senha_hash;
    if (senha) {
      senha_hash = await bcrpytp.hash(senha, saltRounds);
    }

    const fields = [];
    const params = [];

    if (nome) {
      fields.push('nome = ?');
      params.push(nome);
    }
    if (email) {
      fields.push('email = ?');
      params.push(email);
    }
    if (supervisor !== undefined) {
      fields.push('supervisor = ?');
      params.push(supervisor);
    }
    if (departamento_id) {
      fields.push('departamento_id = ?');
      params.push(departamento_id);
    }

    if (fields.length === 0) {
      // Se nenhum campo for enviado ele só retorna o id
      return this.findById(id);
    }

    params.push(id);
    const sql = `update usuarios set ${fields.join(', ')} where id = ?;`;

    const [result] = await connection.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const sql = 'delete from usuarios where id = ?';
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  async findAll(filters = {}) {
    const sql =
      'select id, nome, email, supervisor, admin, departamento_id, criado_em from usuarios ';
    const params = [];
    const whereClauses = [];

    if (filters.nome) {
      whereClauses.push('lower(nome) like lower(?)');
      params.push(`%${filters.nome}%`);
    }

    if (filters.email) {
      whereClauses.push('lower(email) like lower(?)');
      params.push(`%${filters.email}`);
    }

    if (filters.supervisor !== undefined) {
      whereClauses.push('supervisor = ?');
      params.push(filters.supervisor === 'true');
    }

    if (filters.admin !== undefined) {
      whereClauses.push('admin = ?');
      params.push(filters.admin === 'true');
    }

    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' AND ')}`;
    }

    sql += ' order by nome ASC;';

    const [rows] = await connection.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql =
      'select id, nome, email, supervisor, admin, departamento_id, criado_em from usuarios where id = ?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const sql = 'select * from usuarios where email = ?;';
    const [rows] = await connection.execute(sql, [email]);
    return rows[0] || null;
  },

  async comparePassword(senha, senha_hash) {
    return bcrypt.compare(senha, senha_hash);
  },
};

export default Usuario;
