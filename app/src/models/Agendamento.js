import connection from '../database/connection';

const Agendamento = {
  async create({ equipamento_id, usuario_id, horario_inicio, horario_fim }) {
    const sql =
      'insert into Agendamentos (equipamento_id, usuario_id, horario_inicio, horario_fim) values (?, ?, ?, ?);';
    const params = [equipamento_id, usuario_id, horario_inicio, horario_fim];
    const [result] = await connection.execute(sql, params);
    return this.findById(result.insertId);
  },

  async delete(id) {
    const sql = 'delete from Agendamentos where id = ?';
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  async findAll(filters = {}) {
    let sql = 'select * from Agendamentos';
    const params = [];
    const whereClauses = [];

    if (filters.equipamento_id) {
      whereClauses.push('equipamento_id = ?');
      params.push(filters.equipamento_id);
    }

    if (filters.usuario_id) {
      whereClauses.push('usuario_id = ?');
      params.push(filters.usuario_id);
    }

    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' and ')}`;
    }

    sql += ` order by horario_inicio;`;

    const [rows] = await connection.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = 'select * from Agendamentos where id =?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },

  async findOverlapping(equipamento_id, horario_inicio, horario_fim, excludeId = null) {
    let sql = `
      select * from Agendamentos
      where equipamento_id = ?
      and (
        (horario_inicio < ? and horario_fim > ?) or
        (horario_inicio >= ? and horario_inicio < ?) or
        (horario_fim > ? and horario_fim <= ?)
      )
    `;

    const params = [
      equipamento_id,
      horario_fim,
      horario_inicio,
      horario_fim,
      horario_inicio,
      horario_fim,
    ];

    if (excludeId) {
      sql += ' and id != ?';
      params.push(excludeId);
    }

    const [rows] = await connection.execute(sql, params);
    return rows;
  },
};

export default Agendamento;
