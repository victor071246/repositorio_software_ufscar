import Departamento from '../models/Departamento';
import Equipamento from '../models/Equipamento';
import HistoricoEquipamentos from '../models/HistoricoEquipamentos';

const EquipamentoController = {
  async create(req, res) {
    try {
      const { nome, descricao, estado, nome_departamento } = req.body;
      if (!nome || !descricao || !nome_departamento) {
        return res.status(400).json({
          message: "Os campos 'nome', 'descricao' e 'nome_departamento' são obrigatórios.",
        });
      }
      const departamento = await Departamento.findByNome(nome_departamento);

      if (!departamento) {
        return res
          .status(400)
          .json({ message: `Departamentos com nome '${nome_departamento}' não encontrado.` });
      }

      const novoEquipamento = await Equipamento.create({
        nome,
        descricao,
        estado,
        departamento_id: departamento.id,
      });
      res.status(201).json(novoEquipamento);
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
      const equipamentos = await Equipamento.findAll();
      res.status(200).json(equipamentos);
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
      const filters = req.query;
      const equipamentos = await Equipamento.findAll(filters);
      res.status(200).json(equipamentos);
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, estado, nome_departamento } = req.body;

      // Lógica para buscar departamento pelo nome antes de atualizar
      if (!nome || !descricao || !estado || !nome_departamento) {
        return res.status(400).json({
          message:
            "Todos os campos ('nome', 'descricao', 'estado', 'nome_departamento') são obrigatórios para atualização.",
        });
      }
      const departamento = await Departamento.findByNome(nome_departamento);

      if (!departamento) {
        return res
          .status(404)
          .json({ message: `Departamento com nome '${nome_departamento}' não encontrado.` });
      }

      const equipamentoAtualizado = await Equipamento.update(id, {
        nome,
        descricao,
        estado,
        departamento_id: departamento.id,
      });

      if (!equipamentoAtualizado) {
        return res.status(404).json({ message: 'Equipamento não encontrado para atualizar.' });
      }
      res.status(200).json(equipamentoAtualizado);
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
      const sucesso = await Equipamento.delete(id);
      if (!sucesso) {
        return res.status(404).json({ message: 'Equipamento não encontrado para deletar.' });
      }
      return res.status(200).json({ message: 'Equipamento deletado com sucesso' });
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },
};
export default EquipamentoController;
