import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import caminhaoRoutes from './routes/caminhaoRoutes';
import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    nome: 'Caminhões API',
    mensagem: 'API RESTful para gerenciamento de caminhões.',
    documentacao: '/api-docs',
    saude: '/health',
  });
});

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api-docs.json', (_req, res) => res.status(200).json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/caminhoes', caminhaoRoutes);
app.use(notFound);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Caminhões API executando em http://localhost:${port}`);
      console.log(`Swagger UI: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error(
      'Não foi possível conectar ao PostgreSQL. Confira o arquivo .env e se o banco está ativo.',
      error
    );

    process.exit(1);
  }
}

void start();
