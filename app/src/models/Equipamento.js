import connection from '../database/connection';

const Equipamento = {
  async create({ nome, descricao, estado = 'disponível', departamento_id }) {
    const sqlInsert =
      'insert into Equipamentos (nome, descricao, estado, departamento_id) values (?, ?, ?, ?);';
    const params = [nome, descricao, estado, departamento_id];
    const [result] = await connection.execute(sqlInsert, params);
    return [result];
  },

  async update(id, { nome, descricao, estado, departamento_id }) {
    const sqlUpdate =
      'update Equipamentos set nome = ?, descricao = ?, estado = ?, departamento_id = ? where id = ?;';

    const params = [nome, descricao, estado, departamento_id, id];
    const [result] = await connection.execute(sqlUpdate, params);
    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const sqlDelete = 'delete from Equipamentos where id = ?;';
    const [result] = await connection.execute(sqlDelete, [id]);
    return result.affectedRows > 0;
  },

  async findAll(filters = {}) {
    let sql = 'select * from Equipamentos';
    const params = [];
    const whereClauses = [];

    if (filters.nome) {
      whereClauses.push('lower(nome) like lower(?)');
      params.push(`%${filters.nome}%`);
    }

    if (filters.estado) {
      whereClauses.push('lower(estado) = lower(?)');
      params.push(`${filters.estado}`);
    }

    if (filters.departamento_id) {
      whereClauses.push('departamento_id = ?');
      params.push(filters.departamento_id);
    }

    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' and ')}`;
    }

    sql += ' order by nome asc;';

    const [rows] = await connection.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = 'select * from Equipamentos where id = ?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },
};
export default Equipamento;
