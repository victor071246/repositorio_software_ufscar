import connection from '../database/connection.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const Usuario = {
  async create({ usuario, senha, supervisor = false, departamento_id, admin = false }) {
    const senha_hash = await bcrypt.hash(senha, saltRounds);

    const sql =
      'insert into Usuarios (usuario, senha_hash, supervisor, admin, departamento_id) values (?, ?, ?, ?, ?)';
    const params = [usuario, senha_hash, supervisor, admin, departamento_id];

    const [result] = await connection.execute(sql, params);
    return this.findById(result.insertId);
  },

  async update(id, { usuario, senha, supervisor, departamento_id }) {
    const fields = [];
    const params = [];

    if (senha) {
      const senha_hash = await bcrypt.hash(senha, saltRounds);
      fields.push('senha_hash = ?');
      params.push(senha_hash);
    }

    if (usuario) {
      fields.push('usuario = ?');
      params.push(usuario);
    }
    if (supervisor !== undefined) {
      fields.push('supervisor = ?');
      params.push(supervisor);
    }
    if (departamento_id != null) {
      // pega 0, mas ignora undefined e null
      fields.push('departamento_id = ?');
      params.push(departamento_id);
    }

    if (fields.length === 0) {
      // Se nenhum campo for enviado ele só retorna o id
      return this.findById(id);
    }

    params.push(id);
    const sql = `update Usuarios set ${fields.join(', ')} where id = ?;`;

    const [result] = await connection.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const sql = 'delete from Usuarios where id = ?';
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  async findAll(filters = {}) {
    const sql = 'select id, nome,  supervisor, admin, departamento_id, criado_em from Usuarios ';
    const params = [];
    const whereClauses = [];

    if (filters.nome) {
      whereClauses.push('lower(nome) like lower(?)');
      params.push(`%${filters.nome}%`);
    }

    if (filters.departamento_id) {
      whereClauses.push('departamento_id = ?');
      params.push(filters.departamento_id);
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
      'select id, nome, supervisor, admin, departamento_id, criado_em from Usuarios where id = ?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },

  async findByUsername(username) {
    const sql = 'select * from Usuarios where usuario = ?;';
    const [rows] = await connection.execute(sql, [username]);
    return rows[0] || null;
  },

  async comparePassword(senha, senha_hash) {
    return bcrypt.compare(senha, senha_hash);
  },
};

export default Usuario;
