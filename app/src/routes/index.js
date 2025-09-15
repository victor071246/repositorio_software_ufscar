import { Router } from 'express';
import departamentosRoutes from './departamentoRoutes.js';
import equipamentosRoutes from './equipamentoRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import intercorrenciaRoutes from './intercorrenciasRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API de Laboratório rodando!' });
});

router.use('/departamentos', departamentosRoutes);
router.use('/equipamentos', equipamentosRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/intercorrencias', intercorrenciaRoutes);

export default router;
