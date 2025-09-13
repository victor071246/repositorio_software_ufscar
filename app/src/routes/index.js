import { Router } from 'express';
import departamentosRoutes from './departamentoRoutes.js';
import equipamentosRoutes from './equipamentoRoutes.js';

const routes = Router();

routes.get('/', (req, res) => {
  res.json({ message: 'API de Laboratório rodando!' });
});

routes.use('/departamentos', departamentosRoutes);
routes.use('/equipamentos', equipamentosRoutes);
