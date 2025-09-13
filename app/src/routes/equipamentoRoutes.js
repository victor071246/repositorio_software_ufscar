import { Router } from 'express';
import EquipamentoController from '../controllers/EquipamentoController.js';

const router = Router();

// Rota para CRIAR (POST) um novo equipamento
// Ex: POST /equipamentos
router.post('/', EquipamentoController.create);

// Rota para LER (GET) todos os equipamentos
// Ex: GET /equipamentos
router.get('/', EquipamentoController.listAll);

// Rota para LER (GET) um único equipamento pelo ID
// Ex: GET /equipamentos/1
router.get('/:id', EquipamentoController.findOne);

// Rota para ATUALIZAR (PUT) um equipamento pelo ID
// Ex: PUT /equipamentos/1
router.put('/:id', EquipamentoController.update);

// Rota para DELETAR (DELETE) um equipamento pelo ID
// Ex: DELETE /equipamentos/1
router.delete('/:id', EquipamentoController.delete);

export default router;
