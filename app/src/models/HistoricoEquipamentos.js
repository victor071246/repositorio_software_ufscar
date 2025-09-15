import connection from '../database/connection';

const HistoricoEquipamentos = {
  async create({ equipamento_id, usuario_id, estado_anterior, novo_estado }) {
    const sql = `
    insert into Historico_Equipamentos
      (equipamento_id, usuario_id, estado_anterior, novo_estado, data_e_hora)
    values(?, ?, ?, ?, now());
    `;
    const params = [equipamento_id, usuario_id, estado_anterior, novo_estado];
    const [result] = await connection.execute(sql, params);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = 'select * from Historico_Equipamentos';
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

    sql += ' order by data_e_hora desc;';

    const [rows] = await connection.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = 'select * from Historico_Equipamentos where id = ?;';
    const [rows] = await connection.execute(sql, [id]);
    return rows[0] || null;
  },
};

export default HistoricoEquipamentos;
