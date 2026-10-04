import { Router } from 'express';
import {
  atualizarCaminhao,
  buscarCaminhao,
  criarCaminhao,
  excluirCaminhao,
  listarCaminhoes,
} from '../controllers/caminhaoController';

const router = Router();

/**
 * @openapi
 * /caminhoes:
 *   get:
 *     tags: [Caminhões]
 *     summary: Lista todos os caminhões
 *     responses:
 *       200:
 *         description: Lista de caminhões.
 *       500:
 *         description: Erro interno.
 */
router.get('/', listarCaminhoes);

/**
 * @openapi
 * /caminhoes/{id}:
 *   get:
 *     tags: [Caminhões]
 *     summary: Busca um caminhão por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Caminhão encontrado.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Caminhão não encontrado.
 *       500:
 *         description: Erro interno.
 */
router.get('/:id', buscarCaminhao);

/**
 * @openapi
 * /caminhoes:
 *   post:
 *     tags: [Caminhões]
 *     summary: Cadastra um caminhão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaminhaoInput'
 *     responses:
 *       201:
 *         description: Caminhão criado.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno.
 */
router.post('/', criarCaminhao);

/**
 * @openapi
 * /caminhoes/{id}:
 *   put:
 *     tags: [Caminhões]
 *     summary: Atualiza um caminhão
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaminhaoUpdate'
 *     responses:
 *       200:
 *         description: Caminhão atualizado.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Caminhão não encontrado.
 *       500:
 *         description: Erro interno.
 */
router.put('/:id', atualizarCaminhao);

/**
 * @openapi
 * /caminhoes/{id}:
 *   delete:
 *     tags: [Caminhões]
 *     summary: Remove um caminhão
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Caminhão removido.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Caminhão não encontrado.
 *       500:
 *         description: Erro interno.
 */
router.delete('/:id', excluirCaminhao);

export default router;
