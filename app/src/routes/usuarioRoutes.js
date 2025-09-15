import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
// Futuramente, aqui também importaremos os middlewares de autenticação e autorização
// import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota para CRIAR (POST) um novo usuário
// POST /usuarios
router.post('/', UsuarioController.create);

// Rota para LER (GET) todos os usuários, com suporte a filtros via query params
// Ex: GET /usuarios?q=ana&supervisor=true
router.get('/', UsuarioController.listAll);

// Rota para LER (GET) um único usuário pelo ID
// GET /usuarios/1
router.get('/:id', UsuarioController.findOne);

// Rota para ATUALIZAR (PUT) os dados de um usuário pelo ID
// PUT /usuarios/1
router.put('/:id', UsuarioController.update);

// Rota para DELETAR (DELETE) um usuário pelo ID
// DELETE /usuarios/1
router.delete('/:id', UsuarioController.delete);

// Rota para PROMOVER/REBAIXAR um usuário (toggle supervisor status)
// Usamos PATCH pois é uma atualização parcial no recurso
// PATCH /usuarios/1/promote
router.patch('/:id/promote', UsuarioController.promoteToSupervisor);

export default router;
