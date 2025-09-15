import connection from '../database/connection';

const Intercorrencias = {
  async create({ tipo, descricao, data_e_hora, equipamento_id }) {
    const sql =
      'insert into intercorrencias (tipo, descricao, data_e_hora, equipamento_id) values (?, ?, ?, ?);';
    const params = [tipo, descricao, data_e_hora, equipamento_id];

    const [result] = await connection.execute(sql, params);
    return this.findById(result.insertId);
  },

  async update(id, { tipo, descricao, data_e_hora }) {
    const sql = 'update intercorrencias set tipo = ?, descricao = ?, data_e_hora = ? where id = ?;';
    const params = [tipo, descricao, data_e_hora, id];
    const [result] = await connection.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const sql = 'delete from intercorrencias where id = ?;';
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  async findAll(filters = {}) {
    let sql = 'select * from intercorrencias';
    const params = [];
    const whereClauses = [];

    if (filters.equipamento_id) {
      whereClauses.push('equipamento_id = ?');
      params.push(filters.equipamento_id);
    }

    if (filters.tipo) {
      whereClauses.push('lower(tipo) like lower(?)');
      params.push(`%${filters.tipo}%`);
    }

    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' and ')}`;
    }

    sql += ' order by data_e_hora desc;';

    const [rows] = await connection.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = 'select * from intercorrencias where id = ?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },
};

export default Intercorrencias;
