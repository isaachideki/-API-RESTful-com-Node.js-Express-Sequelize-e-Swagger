# Caminhões API — AT1

API RESTful para gerenciamento de caminhões, desenvolvida para a atividade avaliativa de LDW.

## Tecnologias

- Node.js
- Express
- TypeScript com `strict`
- Sequelize ORM
- PostgreSQL
- Swagger / OpenAPI
- CORS

## Requisitos

- Node.js instalado
- PostgreSQL instalado e executando localmente
- Git (opcional)

## Configuração

Entre na pasta `backend` e instale as dependências:

```bash
npm install
```

Copie `.env.example` para `.env` e informe a senha do seu PostgreSQL.

## Banco de dados

A aplicação usa PostgreSQL local por padrão:

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
```

Para executar a migration:

```bash
npm run db:migrate
```

A aplicação também executa `sequelize.sync()` ao iniciar para garantir a tabela do modelo.

## Executar em desenvolvimento

```bash
npm run dev
```

ou:

```bash
npm run build
npm start
```

Servidor:

`http://localhost:3000`

Swagger:

`http://localhost:3000/api-docs`

Health check:

`http://localhost:3000/health`

## CRUD

- `GET /caminhoes`
- `GET /caminhoes/:id`
- `POST /caminhoes`
- `PUT /caminhoes/:id`
- `DELETE /caminhoes/:id`

### Exemplo de POST

```json
{
  "placa": "ABC1D23",
  "marca": "Scania",
  "modelo": "R 450",
  "ano": 2024,
  "capacidadeCarga": 25.5,
  "quilometragem": 120000,
  "tipoCombustivel": "DIESEL_S10",
  "status": "ATIVO"
}
```

## Entrega

A atividade exige demonstrar no vídeo o servidor em execução, o Swagger com POST, GET, GET por ID, PUT e DELETE, além da persistência no PostgreSQL.
