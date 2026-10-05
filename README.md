
API RESTful desenvolvida para o **cadastro e gerenciamento de veículos movidos a diesel**.

O sistema permite cadastrar, consultar, atualizar e remover veículos, armazenando informações como placa, marca, modelo, ano, capacidade de carga, quilometragem, tipo de combustível e status do veículo.

O projeto foi desenvolvido utilizando **Node.js, Express, TypeScript, Sequelize e PostgreSQL**, com documentação da API através do **Swagger**.

---

## 📋 Sobre o projeto

A API foi criada para facilitar o gerenciamento de veículos a diesel, permitindo manter um cadastro centralizado das informações dos veículos.

Através da API é possível:

* Cadastrar veículos;
* Listar veículos cadastrados;
* Buscar um veículo específico;
* Atualizar informações de um veículo;
* Excluir um veículo;
* Consultar os dados através de uma API RESTful;
* Documentar e testar os endpoints utilizando Swagger.

---

## 🛠️ Tecnologias utilizadas

* **Node.js** — ambiente de execução;
* **Express** — framework para construção da API;
* **TypeScript** — tipagem estática;
* **Sequelize** — ORM para comunicação com o banco;
* **PostgreSQL** — banco de dados relacional;
* **Swagger** — documentação e testes dos endpoints;
* **dotenv** — gerenciamento das variáveis de ambiente;
* **CORS** — controle de acesso entre origens.

---

## 📁 Estrutura do projeto

```text
DieselVehicles/
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   └── VeiculoController.ts
│   │
│   ├── models/
│   │   └── Veiculo.ts
│   │
│   ├── routes/
│   │   └── veiculoRoutes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── swagger/
│   └── swagger.json
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Requisitos

Para executar o projeto, é necessário ter instalado:

* Node.js;
* npm;
* PostgreSQL.

Recomenda-se utilizar versões recentes dessas ferramentas.

---

## 🚀 Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

---

## 🔐 Configuração do banco de dados

Crie um banco de dados PostgreSQL para a aplicação.

Em seguida, configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=3000

PORT=3000
DB_HOST=postgress 
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=suasenha
DB_SSL=true
```

Também é possível utilizar o `.env.example` como modelo.

> ⚠️ O arquivo `.env` não deve ser versionado no GitHub, pois pode conter informações sensíveis.

---

## ▶️ Executando a aplicação

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

Após iniciar o servidor, a API estará disponível em:

```text
http://localhost:3000
```

---

# 🚛 Cadastro de veículos

Cada veículo possui as seguintes informações:

| Campo             | Tipo    | Descrição                      |
| ----------------- | ------- | ------------------------------ |
| `id`              | Integer | Identificador único do veículo |
| `placa`           | String  | Placa do veículo               |
| `marca`           | String  | Marca do veículo               |
| `modelo`          | String  | Modelo do veículo              |
| `ano`             | Integer | Ano do veículo                 |
| `capacidadeCarga` | Decimal | Capacidade de carga do veículo |
| `quilometragem`   | Integer | Quilometragem atual            |
| `tipoCombustivel` | Enum    | Tipo de combustível utilizado  |
| `status`          | Enum    | Status atual do veículo        |
| `createdAt`       | Date    | Data de cadastro               |
| `updatedAt`       | Date    | Data da última atualização     |

---

## 📝 Exemplo de cadastro

Para cadastrar um veículo, envie uma requisição:

```http
POST /veiculos
```

Com o seguinte JSON:

```json
{
  "placa": "GLK8743",
  "marca": "Scania",
  "modelo": "R450",
  "ano": 2024,
  "capacidadeCarga": 25.5,
  "quilometragem": 120000,
  "tipoCombustivel": "DIESEL_S500",
  "status": "ATIVO"
}
```

---

# 🔌 Endpoints

## Listar veículos

```http
GET /veiculos
```

Retorna todos os veículos cadastrados.

### Exemplo de resposta

```json
[
  {
    "id": 1,
    "placa": "GLK8743",
    "marca": "Scania",
    "modelo": "R450",
    "ano": 2024,
    "capacidadeCarga": 25.5,
    "quilometragem": 120000,
    "tipoCombustivel": "DIESEL_S500",
    "status": "ATIVO"
  }
]
```

---

## Buscar veículo por ID

```http
GET /veiculos/:id
```

Exemplo:

```http
GET /veiculos/1
```

Retorna os dados do veículo correspondente ao ID informado.

---

## Cadastrar veículo

```http
POST /veiculos
```

Exemplo:

```json
{
  "placa": "GLK8743",
  "marca": "Scania",
  "modelo": "R450",
  "ano": 2024,
  "capacidadeCarga": 25.5,
  "quilometragem": 120000,
  "tipoCombustivel": "DIESEL_S500",
  "status": "ATIVO"
}
```

---

## Atualizar veículo

```http
PUT /veiculos/:id
```

Exemplo:

```http
PUT /veiculos/1
```

```json
{
  "placa": "GLK8743",
  "marca": "Scania",
  "modelo": "R450",
  "ano": 2024,
  "capacidadeCarga": 26,
  "quilometragem": 125000,
  "tipoCombustivel": "DIESEL_S500",
  "status": "ATIVO"
}
```

---

## Excluir veículo

```http
DELETE /veiculos/:id
```

Exemplo:

```http
DELETE /veiculos/1
```

Remove o veículo correspondente ao ID informado.

---

# ⛽ Tipos de combustível

A API trabalha com tipos de combustível definidos para veículos a diesel.

Exemplo:

```text
DIESEL_S500
DIESEL_S10
```

O valor deve ser enviado exatamente conforme definido pela API.

Exemplo:

```json
{
  "tipoCombustivel": "DIESEL_S500"
}
```

---

# 🚦 Status do veículo

O campo `status` representa a situação atual do veículo.

Exemplo:

```text
ATIVO
INATIVO
```

Um veículo com status `ATIVO` está disponível ou em operação, enquanto um veículo `INATIVO` não está atualmente em operação.

---

# 📚 Swagger

A API possui documentação interativa utilizando Swagger.

Com o servidor executando, acesse:

```text
http://localhost:3000/api-docs
```

No Swagger é possível:

* Visualizar todos os endpoints;
* Consultar os parâmetros;
* Visualizar os modelos de dados;
* Executar requisições;
* Cadastrar veículos;
* Consultar veículos;
* Atualizar veículos;
* Excluir veículos;
* Visualizar as respostas da API.

---

# 🧪 Testando a API

Os endpoints podem ser testados utilizando:

* Swagger;
* Postman;
* Insomnia;
* Thunder Client;
* cURL.

### Teste de listagem

```bash
curl http://localhost:3000/veiculos
```

### Teste de cadastro

```bash
curl -X POST http://localhost:3000/veiculos \
-H "Content-Type: application/json" \
-d "{\"placa\":\"GLK8743\",\"marca\":\"Scania\",\"modelo\":\"R450\",\"ano\":2024,\"capacidadeCarga\":25.5,\"quilometragem\":120000,\"tipoCombustivel\":\"DIESEL_S500\",\"status\":\"ATIVO\"}"
```

---

# 🔄 Operações CRUD

A API implementa as principais operações de gerenciamento de veículos:

| Operação      | Método   | Endpoint        |
| ------------- | -------- | --------------- |
| Listar        | `GET`    | `/veiculos`     |
| Buscar por ID | `GET`    | `/veiculos/:id` |
| Cadastrar     | `POST`   | `/veiculos`     |
| Atualizar     | `PUT`    | `/veiculos/:id` |
| Excluir       | `DELETE` | `/veiculos/:id` |

---

# ❌ Tratamento de erros

A API utiliza códigos HTTP para indicar o resultado das operações.

| Código | Significado                    |
| ------ | ------------------------------ |
| `200`  | Operação realizada com sucesso |
| `201`  | Veículo cadastrado com sucesso |
| `400`  | Dados inválidos                |
| `404`  | Veículo não encontrado         |
| `409`  | Conflito, como placa duplicada |
| `500`  | Erro interno do servidor       |

### Exemplo

Caso seja solicitado um veículo inexistente:

```json
{
  "erro": "Veículo não encontrado."
}
```

---

# 🗄️ Persistência

Os dados dos veículos são armazenados em um banco de dados **PostgreSQL**.

O **Sequelize** é utilizado como ORM para realizar a comunicação entre a aplicação e o banco de dados.

Fluxo da aplicação:

```text
Cliente
   ↓
API REST
   ↓
Rotas
   ↓
Controller
   ↓
Model Sequelize
   ↓
PostgreSQL
```

---

# 🔒 Variáveis de ambiente

As configurações do banco e da aplicação devem ser armazenadas através de variáveis de ambiente.

Exemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dieselvehicles
DB_USER=postgres
DB_PASSWORD=sua_senha
```

O arquivo `.env` deve permanecer fora do controle de versão.

---

# 📦 Scripts

Instalar as dependências:

```bash
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Compilar o projeto:

```bash
npm run build
```

Executar a versão compilada:

```bash
npm start
```

---

# 🎯 Objetivo acadêmico

O projeto **DieselVehicles API** foi desenvolvido com finalidade acadêmica, colocando em prática conceitos relacionados ao desenvolvimento de APIs RESTful e à persistência de dados.

Entre os principais conceitos aplicados estão:

* Desenvolvimento de API REST;
* Node.js;
* Express;
* TypeScript;
* Sequelize;
* PostgreSQL;
* CRUD;
* Validação de dados;
* Persistência relacional;
* Documentação com Swagger;
* Métodos HTTP;
* Códigos de status HTTP.

---

## 👨‍💻 Autor

**Isaac Hideki Shiokawa**

Projeto desenvolvido para fins acadêmicos.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e acadêmicos.
