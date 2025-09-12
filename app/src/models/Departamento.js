import connection from '../database/connection.js';

const Departamento = {
  // --- MÉTODOS DE ESCRITA ---

  async create({ nome }) {
    const sqlInsert = 'INSERT INTO Departamentos (nome) VALUES (?);';
    const [result] = await connection.execute(sqlInsert, [nome]);
    return this.findById(result.insertId);
  },

  async update(id, { nome }) {
    const sql = 'UPDATE Departamentos SET nome = ? WHERE id = ?;';
    const [result] = await connection.execute(sql, [nome, id]);
    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const sql = 'DELETE FROM Departamentos WHERE id = ?;';
    const [result] = await connection.execute(sql, [id]);
    return result.affectedRows > 0;
  },

  async findAll() {
    const sqlSelect = 'SELECT * FROM Departamentos ORDER BY nome ASC;';
    const [rows] = await connection.execute(sqlSelect);
    return rows;
  },

  async findById(id) {
    const sqlSelectById = 'SELECT * FROM Departamentos WHERE id = ?;';
    const [rows] = await connection.execute(sqlSelectById, [id]);
    return rows[0] || null;
  },
};

export default Departamento;
