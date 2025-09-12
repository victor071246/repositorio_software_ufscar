import Departamento from '../models/Departamento.js';

const DepartamentoController = {
  async create(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      }
      const novoDepartamento = await Departamento.create({ nome });
      res.status(201).json(novoDepartamento);
    } catch (error) {
      console.error(error); // Log para o dev
      res.status(500).json({ message: 'Erro ao criar departamento.', details: error.message });
    }
  },

  async listAll(req, res) {
    try {
      const departamentos = await Departamento.findAll();
      res.status(200).json(departamentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar departamentos.', details: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const departamento = await Departamento.findById(id);
      if (!departamento) {
        return res.status(404).json({ message: 'Departamento não encontrado.' });
      }
      res.status(200).json(departamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar departamento.', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      }
      const departamentoAtualizado = await Departamento.update(id, { nome });
      if (!departamentoAtualizado) {
        return res.status(404).json({ message: 'Departamento não encontrado para atualizar.' });
      }
      res.status(200).json(departamentoAtualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar departamento.', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await Departamento.delete(id);
      if (!sucesso) {
        return res.status(404).json({ message: 'Departamento não encontrado.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar departamento.', details: error.message });
    }
  },
};

export default DepartamentoController;
