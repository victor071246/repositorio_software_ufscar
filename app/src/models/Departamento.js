import connection from '../database/connection';

const Departamento = {
  async create(req, res) {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }

    const sqlInsert = 'insert into departamentos (nome) values (?);';
    const [result] = await connection.execute(sqlInsert, [nome]);

    const novoId = result.insertId;
  },
};
('');
