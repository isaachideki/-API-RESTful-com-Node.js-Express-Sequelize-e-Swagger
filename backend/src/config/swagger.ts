import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Caminhões API',
      version: '1.0.0',
      description: 'API RESTful para cadastro e gerenciamento de caminhões.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [{ name: 'Caminhões', description: 'Operações de CRUD de caminhões' }],
    components: {
      schemas: {
        CaminhaoInput: {
          type: 'object',
          required: ['placa', 'marca', 'modelo', 'ano', 'capacidadeCarga', 'quilometragem', 'tipoCombustivel'],
          properties: {
            placa: { type: 'string', minLength: 7, maxLength: 7, example: 'ABC1D23' },
            marca: { type: 'string', example: 'Scania' },
            modelo: { type: 'string', example: 'R 450' },
            ano: { type: 'integer', minimum: 1950, maximum: 2100, example: 2024 },
            capacidadeCarga: { type: 'number', format: 'double', minimum: 0, example: 25.5 },
            quilometragem: { type: 'integer', minimum: 0, example: 120000 },
            tipoCombustivel: { type: 'string', enum: ['DIESEL', 'DIESEL_S10', 'DIESEL_S500'], example: 'DIESEL_S10' },
            status: { type: 'string', enum: ['ATIVO', 'MANUTENCAO', 'INATIVO'], example: 'ATIVO' }
          }
        },
        CaminhaoUpdate: {
          type: 'object',
          minProperties: 1,
          properties: {
            placa: { type: 'string', example: 'ABC1D23' },
            marca: { type: 'string', example: 'Scania' },
            modelo: { type: 'string', example: 'R 500' },
            ano: { type: 'integer', example: 2025 },
            capacidadeCarga: { type: 'number', example: 30 },
            quilometragem: { type: 'integer', example: 125000 },
            tipoCombustivel: { type: 'string', enum: ['DIESEL', 'DIESEL_S10', 'DIESEL_S500'] },
            status: { type: 'string', enum: ['ATIVO', 'MANUTENCAO', 'INATIVO'] }
          }
        },
        Caminhao: {
          allOf: [
            { $ref: '#/components/schemas/CaminhaoInput' },
            {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          ]
        },
        Erro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Dados inválidos.' },
            detalhes: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
