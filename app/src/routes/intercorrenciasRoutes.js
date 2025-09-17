import { Router } from 'express';
import IntercorrenciasController from '../controllers/IntercorrenciasController.js';

const router = Router();

// Rota para CRIAR (POST) uma nova intercorrência
// POST /intercorrencias
router.post('/', IntercorrenciasController.create);

// Rota para LER (GET) todas as intercorrências (com filtros)
// GET /intercorrencias
router.get('/', IntercorrenciasController.listAll);

// Rota para LER (GET) uma única intercorrência pelo ID
// GET /intercorrencias/1
router.get('/:id', IntercorrenciasController.findOne);

// Rota para ATUALIZAR (PUT) uma intercorrência pelo ID
// PUT /intercorrencias/1
router.put('/:id', IntercorrenciasController.update);

// Rota para DELETAR (DELETE) uma intercorrência pelo ID
// DELETE /intercorrencias/1
router.delete('/:id', IntercorrenciasController.delete);

export default router;
