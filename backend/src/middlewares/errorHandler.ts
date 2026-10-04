import type { ErrorRequestHandler, RequestHandler } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: error.errors.map((item) => item.message),
    });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
    return;
  }

  console.error(error);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
};
