import { Request, Response } from 'express';
import { WhereOptions } from 'sequelize';
import {
  Pet,
  PetAttributes,
  PetCreationAttributes,
  ESPECIES,
  PORTES,
  Especie,
  Porte
} from '../models/Pet';

type PetInput = Partial<
  Pick<PetAttributes, 'nome' | 'especie' | 'porte' | 'idade_meses' | 'peso_kg' | 'descricao' | 'adotado'>
>;

interface ResultadoValidacao {
  erros: string[];
  dados: PetInput;
}

function isObject(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function isEspecie(valor: unknown): valor is Especie {
  return typeof valor === 'string' && (ESPECIES as readonly string[]).includes(valor);
}

function isPorte(valor: unknown): valor is Porte {
  return typeof valor === 'string' && (PORTES as readonly string[]).includes(valor);
}

/**
 * Valida o corpo da requisição (req.body).
 * - criacao: nome, especie, porte e idade_meses são obrigatórios.
 * - atualização (parcial): apenas os campos enviados são validados, mas ao menos um é exigido.
 */
function validarCorpo(body: unknown, criacao: boolean): ResultadoValidacao {
  const erros: string[] = [];
  const dados: PetInput = {};

  if (!isObject(body)) {
    return { erros: ['O corpo da requisição deve ser um objeto JSON.'], dados };
  }

  // nome
  if (body.nome === undefined) {
    if (criacao) erros.push('O campo "nome" é obrigatório.');
  } else if (typeof body.nome !== 'string' || body.nome.trim() === '') {
    erros.push('O campo "nome" deve ser um texto não vazio.');
  } else if (body.nome.trim().length > 100) {
    erros.push('O campo "nome" deve ter no máximo 100 caracteres.');
  } else {
    dados.nome = body.nome.trim();
  }

  // especie
  if (body.especie === undefined) {
    if (criacao) erros.push('O campo "especie" é obrigatório.');
  } else if (!isEspecie(body.especie)) {
    erros.push(`O campo "especie" deve ser um dos valores: ${ESPECIES.join(', ')}.`);
  } else {
    dados.especie = body.especie;
  }

  // porte
  if (body.porte === undefined) {
    if (criacao) erros.push('O campo "porte" é obrigatório.');
  } else if (!isPorte(body.porte)) {
    erros.push(`O campo "porte" deve ser um dos valores: ${PORTES.join(', ')}.`);
  } else {
    dados.porte = body.porte;
  }

  // idade_meses
  if (body.idade_meses === undefined) {
    if (criacao) erros.push('O campo "idade_meses" é obrigatório.');
  } else if (
    typeof body.idade_meses !== 'number' ||
    !Number.isInteger(body.idade_meses) ||
    body.idade_meses < 0 ||
    body.idade_meses > 600
  ) {
    erros.push('O campo "idade_meses" deve ser um número inteiro entre 0 e 600.');
  } else {
    dados.idade_meses = body.idade_meses;
  }

  // peso_kg (opcional, aceita null)
  if (body.peso_kg !== undefined) {
    if (body.peso_kg === null) {
      dados.peso_kg = null;
    } else if (typeof body.peso_kg !== 'number' || !(body.peso_kg > 0) || body.peso_kg > 999.99) {
      erros.push('O campo "peso_kg" deve ser um número maior que 0 e até 999.99.');
    } else {
      dados.peso_kg = body.peso_kg;
    }
  }

  // descricao (opcional, aceita null)
  if (body.descricao !== undefined) {
    if (body.descricao === null) {
      dados.descricao = null;
    } else if (typeof body.descricao !== 'string' || body.descricao.length > 1000) {
      erros.push('O campo "descricao" deve ser um texto com até 1000 caracteres.');
    } else {
      dados.descricao = body.descricao;
    }
  }

  // adotado (opcional)
  if (body.adotado !== undefined) {
    if (typeof body.adotado !== 'boolean') {
      erros.push('O campo "adotado" deve ser verdadeiro ou falso (boolean).');
    } else {
      dados.adotado = body.adotado;
    }
  }

  if (!criacao && erros.length === 0 && Object.keys(dados).length === 0) {
    erros.push('Informe ao menos um campo para atualizar.');
  }

  return { erros, dados };
}

/**
 * Valida o parâmetro de rota :id. Os parâmetros chegam sempre como string,
 * então é preciso garantir que representam um inteiro positivo.
 */
function lerId(req: Request): number | null {
  const bruto = req.params.id;
  if (typeof bruto !== 'string' || !/^\d+$/.test(bruto)) return null;
  const id = parseInt(bruto, 10);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function lerQuery(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor !== '' ? valor : undefined;
}

function erroInterno(res: Response, acao: string, error: unknown): Response {
  console.error(`Erro ao ${acao}:`, error);
  return res.status(500).json({ erro: `Erro interno ao ${acao}.` });
}

export class PetController {
  // GET /api/pets  (filtros opcionais: ?especie=&porte=&adotado=)
  static async index(req: Request, res: Response): Promise<Response> {
    try {
      const especie = lerQuery(req.query.especie);
      const porte = lerQuery(req.query.porte);
      const adotado = lerQuery(req.query.adotado);
      const erros: string[] = [];
      const where: WhereOptions<PetAttributes> = {};

      if (especie !== undefined) {
        if (isEspecie(especie)) where.especie = especie;
        else erros.push(`Filtro "especie" inválido. Use: ${ESPECIES.join(', ')}.`);
      }
      if (porte !== undefined) {
        if (isPorte(porte)) where.porte = porte;
        else erros.push(`Filtro "porte" inválido. Use: ${PORTES.join(', ')}.`);
      }
      if (adotado !== undefined) {
        if (adotado === 'true' || adotado === 'false') where.adotado = adotado === 'true';
        else erros.push('Filtro "adotado" inválido. Use: true ou false.');
      }

      if (erros.length > 0) {
        return res.status(400).json({ erro: 'Filtros inválidos.', detalhes: erros });
      }

      const pets = await Pet.findAll({ where, order: [['id', 'ASC']] });
      return res.status(200).json(pets);
    } catch (error: unknown) {
      return erroInterno(res, 'listar pets', error);
    }
  }

  // GET /api/pets/:id
  static async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = lerId(req);
      if (id === null) {
        return res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      }

      const pet = await Pet.findByPk(id);
      if (!pet) {
        return res.status(404).json({ erro: 'Pet não encontrado.' });
      }
      return res.status(200).json(pet);
    } catch (error: unknown) {
      return erroInterno(res, 'buscar pet', error);
    }
  }

  // POST /api/pets
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { erros, dados } = validarCorpo(req.body, true);
      if (erros.length > 0) {
        return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
      }

      // Campos obrigatórios já foram garantidos pela validação acima
      const novoPet = await Pet.create(dados as PetCreationAttributes);
      return res.status(201).json(novoPet);
    } catch (error: unknown) {
      return erroInterno(res, 'cadastrar pet', error);
    }
  }

  // PUT /api/pets/:id  (atualização dos campos enviados)
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = lerId(req);
      if (id === null) {
        return res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      }

      const { erros, dados } = validarCorpo(req.body, false);
      if (erros.length > 0) {
        return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
      }

      const pet = await Pet.findByPk(id);
      if (!pet) {
        return res.status(404).json({ erro: 'Pet não encontrado.' });
      }

      await pet.update(dados);
      return res.status(200).json(pet);
    } catch (error: unknown) {
      return erroInterno(res, 'atualizar pet', error);
    }
  }

  // DELETE /api/pets/:id
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = lerId(req);
      if (id === null) {
        return res.status(400).json({ erro: 'O parâmetro "id" deve ser um número inteiro positivo.' });
      }

      const pet = await Pet.findByPk(id);
      if (!pet) {
        return res.status(404).json({ erro: 'Pet não encontrado.' });
      }

      await pet.destroy();
      return res.status(204).send();
    } catch (error: unknown) {
      return erroInterno(res, 'remover pet', error);
    }
  }
}
