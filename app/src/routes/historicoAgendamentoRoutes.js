import { Router } from 'express';
import HistoricoEquipamentosController from '../controllers/HistorioEquipamentosController.js';

const router = Router();

// Rota para LER (GET) todo o histórico (com filtros)
// Ex: GET /historico-equipamentos?equipamento_id=1
router.get('/', HistoricoEquipamentosController.listAll);

// Rota para LER (GET) um único registo de histórico pelo ID
// GET /historico-equipamentos/1
router.get('/:id', HistoricoEquipamentosController.findOne);

export default router;
