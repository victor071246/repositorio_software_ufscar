import Departamento from '../models/Departamento';
import Equipamento from '../models/Equipamento';

const EquipamentoController = {
  async create(req, res) {
    try {
      const { nome, descricao, estado, nome_departamento } = req.body;
      if (!nome || !descricao || !nome_departamento) {
        return res.status(400).json({
          message: "Os cmapso 'nome', 'descricao' e 'nome_departamento' são obrigatórios.",
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
      res.status(500).json({ message: e.map((e) => e.errors.message) });
    }
  },

  async listAll(req, res) {
    try {
      const equipamentos = await Equipamento.findAll();
      res.status(200).json(equipamentos);
    } catch (e) {
      res.status(500).json({ message: e.map((e) => e.errors.message) });
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const equipamento = await Equipamento.findById(id);
      if (!equipamento) {
        return res.status(404).json({ message: 'Equipamento não encontrado' });
      }
    } catch (e) {
      res.status(500).json({ message: e.map((e) => e.errors.message) });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, estado, nome_departamento } = req.body;

      // Lógica para buscar departamento pelo nome antes de atualizar
      if (!nome || !descricao | !estado | !nome_departamento) {
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
      res.status(500).json({ message: e.map((e) => e.erros.message) });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await Equipamento.delete(id);
      if (!sucesso) {
        return res.status(404).json({ message: 'Equipamento não encontrado para deletar.' });
      }
      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar equipamento.', details: error.message });
    }
  },
};
export default EquipamentoController;
