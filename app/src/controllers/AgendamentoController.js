import Agendamento from '../models/Agendamento';
import Usuario from '../models/Usuario';
import Equipamento from '../models/Equipamento';

const AgendamentoController = {
  async create(req, res) {
    try {
      const { equipamento_id, usuario_id, horario_inicio, horario_fim } = req.body;
      if (!equipamento_id || !usuario_id || !horario_inicio || !horario_fim) {
        return res.status(400).json({
          message:
            "Os campos 'equipamento_id', 'usuario_id', 'horario_inicio' e 'horario_fim' são obrigatórios.",
        });
      }

      const usuario = await Usuario.findById(usuario_id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      const equipamento = await Equipamento.findById(equipamento_id);
      if (!equipamento) {
        return res.status(404).json({ message: 'Equipamento não encontrado.' });
      }

      const conflitos = await Agendamento.findOverlapping(
        equipamento_id,
        horario_inicio,
        horario_fim,
      );
      if (conflitos.length > 0) {
        return res.status(400).json({
          message: 'este equipamento já está agendado para o período solicitado',
          conflitos,
        });
      }

      const novoAgendamento = await Agendamento.create({
        equipamento_id,
        usuario_id,
        horario_inicio,
        horario_fim,
      });
      res.status(201).json(novoAgendamento);
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
      const agendamentos = await Agendamento.findAll(filters);
      res.status(200).json(agendamentos);
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await Agendamento.findById(id);
      if (!agendamento) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
      res.status(200).json(agendamento);
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
      const sucesso = await Agendamento.delete(id);
      if (!sucesso) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
      return res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },
};

export default AgendamentoController;
