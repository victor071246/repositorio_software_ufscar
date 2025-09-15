import { Router } from 'express';
import IntercorrenciaController from '../controllers/IntercorrenciaController.js';

const router = Router();

// Rota para CRIAR (POST) uma nova intercorrência
// POST /intercorrencias
router.post('/', IntercorrenciaController.create);

// Rota para LER (GET) todas as intercorrências (com filtros)
// GET /intercorrencias
router.get('/', IntercorrenciaController.listAll);

// Rota para LER (GET) uma única intercorrência pelo ID
// GET /intercorrencias/1
router.get('/:id', IntercorrenciaController.findOne);

// Rota para ATUALIZAR (PUT) uma intercorrência pelo ID
// PUT /intercorrencias/1
router.put('/:id', IntercorrenciaController.update);

// Rota para DELETAR (DELETE) uma intercorrência pelo ID
// DELETE /intercorrencias/1
router.delete('/:id', IntercorrenciaController.delete);

export default router;
