import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController.js';

const router = Router();

// Rota para CRIAR (POST) um novo agendamento
// POST /agendamentos
router.post('/', AgendamentoController.create);

// Rota para LER (GET) todos os agendamentos (com filtros)
// GET /agendamentos?equipamento_id=1
router.get('/', AgendamentoController.listAll);

// Rota para LER (GET) um único agendamento pelo ID
// GET /agendamentos/1
router.get('/:id', AgendamentoController.findOne);

// Rota para DELETAR (DELETE) um agendamento pelo ID
// DELETE /agendamentos/1
router.delete('/:id', AgendamentoController.delete);

export default router;
