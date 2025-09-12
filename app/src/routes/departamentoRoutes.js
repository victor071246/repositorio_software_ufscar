import { Router } from 'express';
import DepartamentoController from '../controllers/DepartamentoController.js';

const router = Router();

// Rota para CRIAR (POST) um novo departamento
// POST /departamentos
router.post('/', DepartamentoController.create);

// Rota para LER (GET) todos os departamentos
// GET /departamentos
router.get('/', DepartamentoController.listAll);

// Rota para LER (GET) um único departamento pelo ID
// GET /departamentos/1
router.get('/:id', DepartamentoController.findOne);

// Rota para ATUALIZAR (PUT) um departamento pelo ID
// PUT /departamentos/1
router.put('/:id', DepartamentoController.update);

// Rota para DELETAR (DELETE) um departamento pelo ID
// DELETE /departamentos/1
router.delete('/:id', DepartamentoController.delete);

export default router;
