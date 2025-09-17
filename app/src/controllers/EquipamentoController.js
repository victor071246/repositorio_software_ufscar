import Departamento from '../models/Departamento.js';
import Equipamento from '../models/Equipamento.js';
import HistoricoEquipamentos from '../models/HistoricoEquipamentos.js';

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
      const { nome, descricao, estado, nome_departamento, usuario_id } = req.body;

      // Lógica para buscar departamento pelo nome antes de atualizar
      if (!nome || !descricao || !estado || !nome_departamento) {
        return res.status(400).json({
          message:
            "Todos os campos ('nome', 'descricao', 'estado', 'nome_departamento') são obrigatórios para atualização.",
        });
      }

      // 1. Buscar o estado atual do equipamento

      const equipamentoAtual = await Equipamento.findById(id);
      if (!equipamentoAtual) {
        res.status(404).json({ message: 'Equipamento não encontrado para atualizar.' });
      }
      const estado_anterior = equipamentoAtual.estado;

      // Lógica para buscar departamento pelo nome

      const departamento = await Departamento.findByNome(nome_departamento);
      if (!departamento) {
        return res
          .status(404)
          .json({ message: `Departamento com nome '${nome_departamento}' não encontrado` });
      }

      // 2. Realizar a atualização

      const dadosParaAtualizar = { nome, descricao, estado, departamento_id: departamento.id };
      const equipamentoAtualizado = await Equipamento.update(id, dadosParaAtualizar);

      // 3. Se a atualização funcionou e o estado mudou, cria o registro
      if (equipamentoAtualizado && estado && estado !== estado_anterior) {
        if (!usuario_id) {
          return res
            .status(404)
            .json({ message: 'Usuário para realizar a atualização não encontrado' });
        }
        await HistoricoEquipamentos.create({
          equipamento_id: id,
          usuario_id: usuario_id,
          estado_anterior: estado_anterior,
          novo_estado: estado,
        });
      }
      return res.status(200).json({ message: 'Equipamento atualizado' });
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
