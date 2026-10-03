import { Router, Request, Response } from 'express';
import { petRoutes } from './petRoutes';

const appRoutes = Router();

// Rota de Health Check
appRoutes.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Servidor Backend rodando com sucesso.',
    timestamp: new Date().toISOString()
  });
});

appRoutes.use('/pets', petRoutes);

export { appRoutes };
