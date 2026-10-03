import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './config/database';
import swaggerDocument from './docs/swagger.json';
import { appRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Documentação interativa (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

// Rotas da aplicação
app.use('/api', appRoutes);

// Rota não encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

interface ErroHttp {
  status?: number;
  type?: string;
}

// Tratamento global de erros (ex.: JSON malformado no corpo da requisição)
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  const erroHttp = (typeof error === 'object' && error !== null ? error : {}) as ErroHttp;

  if (erroHttp.type === 'entity.parse.failed') {
    res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
    return;
  }

  console.error('Erro não tratado:', error);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o PostgreSQL realizada com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Swagger UI disponível em: http://localhost:${PORT}/api-docs`);
      console.log(`Health Check disponível em: http://localhost:${PORT}/api/health`);
    });
  } catch (error: unknown) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

main();
