import HistoricoEquipamentos from '../models/HistoricoEquipamentos';

const HistoricoEquipamentosController = {
  async listAll(req, res) {
    try {
      const historico = await HistoricoEquipamentos.findAll(filters);
      res.status(200).json(historico);
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
      const registro = await HistoricoEquipamentos.findById(id);
      if (!registro) {
        return res.status(400).json({ message: 'Registro de histórico não encontrado' });
      }
    } catch (e) {
      if (e.errors) {
        return res.status(500).json({ message: e.errors.map((err) => err.message) });
      } else {
        return res.status(500).json({ message: e.message });
      }
    }
  },
};

export default HistoricoEquipamentosController;
