import Intercorrencias from '../models/Intercorrencias';
import Equipamento from '../models/Equipamento';
import { json } from 'express';

const IntercorrenciasController = {
  async create(req, res) {
    try {
      const { tipo, descricao, data_e_hora, equipamento_id } = req.body;
      if (!tipo || !descricao || !data_e_hora || !equipamento_id) {
        return res.status(400).json({
          message:
            "os campos 'tipo', 'descricao', 'data_e_hora' e 'equipamento_id' são obrigatórios.",
        });
      }

      const equipamento = await Equipamento.findById(equipamento_id);
      if (!equipamento) {
        return res.status(404).json('Equipamento não encontrado.');
      }

      const novaIntercorrencia = await Intercorrencias.create({
        tipo,
        descricao,
        data_e_hora,
        equipamento_id,
      });
      res.status(201).json(novaIntercorrencia);
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },

  async listAll(req, res) {
    try {
      const filters = req.query;
      const intercorrencias = await Intercorrencias.findAll(filters);
      res.status(200).json(intercorrencias);
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },

  async findOne(req, res) {
    const { id } = req.params;
    const intercorrencia = await Intercorrencia.findById(id);
    if (!intercorrencia) {
      return res.status(400).json({ message: 'Intercorrência não encontrada' });
    }
    return res.status(200).json(intercorrencia);
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { tipo, descricao, data_e_hora } = req.body;

      if (!tipo || !descricao || !data_e_hora) {
        return res.status(400).json({
          message: "'tipo', 'descricao' e 'data_e_hora' são necessários para atualização.",
        });
      }

      const intercorrenciaAtual = await Intercorrencias.findById(id);
      if (!intercorrenciaAtual) {
        return res.status(400).json({ message: 'Intercorrência não encontrada para atualizar.' });
      }

      const intercorrenciaAtualizada = await Intercorrencias.update(id, {
        tipo,
        descricao,
        data_e_hora,
      });

      if (!intercorrenciaAtualizada) {
        return res
          .status(404)
          .json({ message: 'Intercorrência atualizada não encontrada, erro na operação' });
      }

      res.status(200).json(intercorrenciaAtualizada);
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const intercorrencia = await Intercorrencias.findById(id);
      if (!intercorrencia) {
        return res.status(400).json({ message: 'Intercorrência não encontrada' });
      }
      const sucesso = await Intercorrencias.delete(id);
      if (!sucesso) {
        return res.status(200).json({ message: 'Ocorreu um erro ao deletar a intercorrência' });
      }
      return res.status(200).json({ message: 'Intercorrência deletada com sucesso' });
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },
};

export default IntercorrenciasController;
