import type { Request, Response, NextFunction } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import {
  Caminhao,
  type CaminhaoInput,
  tiposCombustivel,
  statusCaminhao,
  type TipoCombustivel,
  type StatusCaminhao,
} from '../models/Caminhao';

const obrigatorios = ['placa', 'marca', 'modelo', 'ano', 'capacidadeCarga', 'quilometragem', 'tipoCombustivel'];

function validarEntrada(body: unknown, parcial = false): string[] {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return ['O corpo deve ser um objeto JSON.'];
  }
  const data = body as Record<string, unknown>;
  const erros: string[] = [];

  if (!parcial) {
    for (const campo of obrigatorios) {
      if (!(campo in data) || data[campo] === '' || data[campo] === null || data[campo] === undefined) {
        erros.push(`O campo "${campo}" é obrigatório.`);
      }
    }
  }

  for (const campo of ['placa', 'marca', 'modelo']) {
    if (campo in data && (typeof data[campo] !== 'string' || data[campo].trim() === '')) {
      erros.push(`"${campo}" deve ser um texto não vazio.`);
    }
  }

  if ('placa' in data && typeof data.placa === 'string') {
    const placa = data.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (placa.length !== 7) erros.push('"placa" deve possuir 7 caracteres.');
  }

  if ('ano' in data && (!Number.isInteger(data.ano) || Number(data.ano) < 1950 || Number(data.ano) > 2100)) {
    erros.push('"ano" deve ser um inteiro entre 1950 e 2100.');
  }

  if (
    'capacidadeCarga' in data &&
    (typeof data.capacidadeCarga !== 'number' || !Number.isFinite(data.capacidadeCarga) || data.capacidadeCarga <= 0)
  ) {
    erros.push('"capacidadeCarga" deve ser um número maior que zero.');
  }

  if (
    'quilometragem' in data &&
    (!Number.isInteger(data.quilometragem) || Number(data.quilometragem) < 0)
  ) {
    erros.push('"quilometragem" deve ser um inteiro maior ou igual a zero.');
  }

  if ('tipoCombustivel' in data && !tiposCombustivel.includes(data.tipoCombustivel as TipoCombustivel)) {
    erros.push(`"tipoCombustivel" deve ser: ${tiposCombustivel.join(', ')}.`);
  }

  if ('status' in data && !statusCaminhao.includes(data.status as StatusCaminhao)) {
    erros.push(`"status" deve ser: ${statusCaminhao.join(', ')}.`);
  }

  return erros;
}

function lerId(value: string | string[]): number | null {
  if (Array.isArray(value) || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function listarCaminhoes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const caminhoes = await Caminhao.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(caminhoes);
  } catch (error) {
    next(error);
  }
}

export async function buscarCaminhao(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = lerId(req.params.id);
    if (!id) {
      res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      return;
    }

    const caminhao = await Caminhao.findByPk(id);
    if (!caminhao) {
      res.status(404).json({ erro: 'Caminhão não encontrado.' });
      return;
    }

    res.status(200).json(caminhao);
  } catch (error) {
    next(error);
  }
}

export async function criarCaminhao(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const erros = validarEntrada(req.body);
    if (erros.length) {
      res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
      return;
    }

    const data = req.body as CaminhaoInput;
    data.placa = data.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const caminhao = await Caminhao.create(data);
    res.status(201).json(caminhao);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(400).json({ erro: 'Já existe um caminhão cadastrado com essa placa.' });
      return;
    }
    if (error instanceof ValidationError) {
      res.status(400).json({ erro: 'Dados inválidos.', detalhes: error.errors.map((item) => item.message) });
      return;
    }
    next(error);
  }
}

export async function atualizarCaminhao(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = lerId(req.params.id);
    if (!id) {
      res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      return;
    }

    const data = req.body as Record<string, unknown>;
    const camposPermitidos = ['placa', 'marca', 'modelo', 'ano', 'capacidadeCarga', 'quilometragem', 'tipoCombustivel', 'status'];
    const desconhecido = Object.keys(data).find((campo) => !camposPermitidos.includes(campo));
    if (desconhecido) {
      res.status(400).json({ erro: `Campo não permitido: ${desconhecido}.` });
      return;
    }

    const erros = validarEntrada(data, true);
    if (erros.length || Object.keys(data).length === 0) {
      res.status(400).json({
        erro: 'Dados inválidos.',
        detalhes: erros.length ? erros : ['Envie ao menos um campo para atualização.'],
      });
      return;
    }

    const caminhao = await Caminhao.findByPk(id);
    if (!caminhao) {
      res.status(404).json({ erro: 'Caminhão não encontrado.' });
      return;
    }

    if (typeof data.placa === 'string') {
      data.placa = data.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    await caminhao.update(data);
    res.status(200).json(caminhao);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(400).json({ erro: 'Já existe um caminhão cadastrado com essa placa.' });
      return;
    }
    if (error instanceof ValidationError) {
      res.status(400).json({ erro: 'Dados inválidos.', detalhes: error.errors.map((item) => item.message) });
      return;
    }
    next(error);
  }
}

export async function excluirCaminhao(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = lerId(req.params.id);
    if (!id) {
      res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      return;
    }

    const caminhao = await Caminhao.findByPk(id);
    if (!caminhao) {
      res.status(404).json({ erro: 'Caminhão não encontrado.' });
      return;
    }

    await caminhao.destroy();
    res.status(200).json({ mensagem: 'Caminhão removido com sucesso.', id });
  } catch (error) {
    next(error);
  }
}
