import { Router } from 'express';
import HistoricoEquipamentoController from '../controllers/HistoricoEquipamentoController.js';

const router = Router();

// Rota para LER (GET) todo o histórico (com filtros)
// Ex: GET /historico-equipamentos?equipamento_id=1
router.get('/', HistoricoEquipamentoController.listAll);

// Rota para LER (GET) um único registo de histórico pelo ID
// GET /historico-equipamentos/1
router.get('/:id', HistoricoEquipamentoController.findOne);

export default router;
