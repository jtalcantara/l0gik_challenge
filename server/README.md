# 🚀 Challenge L0gik - Backend API

API REST robusta para sistema de gestão de leads desenvolvida em Node.js com Express.js.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Sistema de Permissões](#-sistema-de-permissões)
- [Banco de Dados](#-banco-de-dados)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)

## 🎯 Visão Geral

O backend do Challenge L0gik é uma API REST completa que oferece:

- **Endpoints RESTful** para CRUD de leads
- **Autenticação JWT** com sistema de permissões
- **Banco SQLite** em memória com seeder automático
- **Validação robusta** de dados
- **Sistema de permissões** granular
- **Exportação** de dados em CSV
- **Middleware** de segurança e validação
- **Deploy automático** com Vercel

### 🌐 Base URL
```
http://localhost:3000/api
```

## 🛠️ Tecnologias

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas

### Segurança
- **Helmet** - Headers de segurança
- **CORS** - Controle de origem
- **Yup** - Validação de dados

### Utilitários
- **UUID** - Geração de IDs únicos
- **CSV Writer** - Exportação CSV
- **SQLite3** - Banco de dados em memória
- **Module Alias** - Aliases de módulos

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em desenvolvimento
```bash
npm run dev
```

### 3. Executar em produção
```bash
npm start
```

## 🔧 Scripts Disponíveis

| Script | Descrição | Porta |
|--------|-----------|-------|
| `npm run dev` | Executa com nodemon (desenvolvimento) | 3000 |
| `npm start` | Executa em produção | 3000 |
| `npm install` | Instala dependências | - |

## 🔌 Endpoints da API

### 🔐 Autenticação

#### POST /api/auth/login
**Descrição**: Realizar login no sistema
**Acesso**: Público

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "jwt_token_aqui",
    "user": {
      "id": "1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### GET /api/auth/verify
**Descrição**: Verificar validade do token
**Acesso**: Autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### POST /api/auth/register
**Descrição**: Registrar novo usuário (apenas admin)
**Acesso**: Autenticado + Admin

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "novo_usuario",
  "password": "senha123",
  "role": "operador"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "id": "uuid",
    "username": "novo_usuario",
    "role": "operador"
  }
}
```

### 📊 Leads

#### GET /api/leads
**Descrição**: Listar leads com paginação e busca
**Acesso**: Autenticado

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Busca por nome ou email

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(11) 99999-9999",
        "cargo": "Desenvolvedor",
        "dataNascimento": "1990-01-01",
        "mensagem": "Interesse no produto",
        "tracking": {
          "utm_source": "google",
          "utm_medium": "cpc",
          "utm_campaign": "campanha_2024",
          "utm_term": "desenvolvimento",
          "utm_content": "banner_principal",
          "gclid": "abc123",
          "fbclid": "def456"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

#### POST /api/leads
**Descrição**: Criar novo lead (endpoint público)
**Acesso**: Público

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cargo": "Desenvolvedor",
  "dataNascimento": "1990-01-01",
  "mensagem": "Interesse em conhecer mais sobre o produto",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "campanha_2024",
  "utm_term": "desenvolvimento",
  "utm_content": "banner_principal",
  "gclid": "abc123",
  "fbclid": "def456"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso",
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cargo": "Desenvolvedor",
    "dataNascimento": "1990-01-01",
    "mensagem": "Interesse em conhecer mais sobre o produto",
    "tracking": {
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "campanha_2024",
      "utm_term": "desenvolvimento",
      "utm_content": "banner_principal",
      "gclid": "abc123",
      "fbclid": "def456"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/leads/:id
**Descrição**: Obter lead por ID
**Acesso**: Autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cargo": "Desenvolvedor",
    "dataNascimento": "1990-01-01",
    "mensagem": "Interesse em conhecer mais sobre o produto",
    "tracking": {
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "campanha_2024",
      "utm_term": "desenvolvimento",
      "utm_content": "banner_principal",
      "gclid": "abc123",
      "fbclid": "def456"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/leads/:id
**Descrição**: Atualizar lead existente
**Acesso**: Autenticado + Admin

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** Mesmo formato do POST

**Response (200):** Lead atualizado

#### DELETE /api/leads/:id
**Descrição**: Deletar lead
**Acesso**: Autenticado + Admin

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deletado com sucesso",
  "data": {
    "id": "uuid",
    "deletedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 📤 Exportação

#### GET /api/leads/export/csv
**Descrição**: Exportar leads em CSV
**Acesso**: Autenticado + Admin

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Arquivo CSV para download

#### GET /api/leads/limited
**Descrição**: Listar leads com informações limitadas (apenas operador)
**Acesso**: Autenticado + Operador

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `search` (opcional): Busca por nome ou email

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(11) 99999-9999",
        "cargo": "Desenvolvedor",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

#### GET /api/leads/limited/:id
**Descrição**: Obter lead limitado por ID (apenas operador)
**Acesso**: Autenticado + Operador

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cargo": "Desenvolvedor",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```


## 🔐 Autenticação

### JWT Token
Todos os endpoints administrativos requerem token JWT no header:
```
Authorization: Bearer <token>
```

### Geração de Token
```javascript
// middleware/auth.js
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '24h'
  })
}
```

### Verificação de Token
```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return HttpResponses.error(res, { 
      message: 'Token de acesso necessário' 
    }, 401)
  }
  
  const token = authHeader.split(' ')[1]
  
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return HttpResponses.error(res, { 
        message: 'Token inválido ou expirado' 
      }, 403)
    }
    
    req.user = user
    next()
  })
}
```

## 🛡️ Sistema de Permissões

### Roles (Funções)

#### 👨‍💼 Admin
- ✅ **canRead**: Visualizar todos os dados
- ✅ **canWrite**: Editar leads
- ✅ **canDelete**: Deletar leads
- ✅ **canExport**: Exportar dados
- ✅ **canViewAll**: Ver dados completos
- ✅ **canManageUsers**: Gerenciar usuários

#### 👨‍💻 Operador
- ✅ **canRead**: Visualizar dados limitados
- ❌ **canWrite**: Não pode editar
- ❌ **canDelete**: Não pode deletar
- ❌ **canExport**: Não pode exportar
- ❌ **canViewAll**: Dados limitados
- ❌ **canManageUsers**: Não pode gerenciar

### Middlewares de Permissão

#### Verificação de Permissão
```javascript
// middleware/permissions.js
const checkPermissionRead = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { 
      message: 'Usuário não autenticado' 
    }, 401)
  }

  const userPermissions = getRolePermissions(req.user.role)
  if (!userPermissions || !userPermissions.canRead) {
    return HttpResponses.error(res, { 
      message: 'Acesso negado. Permissão de leitura necessária.' 
    }, 403)
  }

  next()
}
```

#### Verificação de Admin
```javascript
// middleware/permissions.js
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { 
      message: 'Usuário não autenticado' 
    }, 401)
  }

  if (req.user.role !== 'admin') {
    return HttpResponses.error(res, { 
      message: 'Acesso negado. Permissão de admin necessária.' 
    }, 403)
  }

  next()
}
```

### Uso nas Rotas
```javascript
// routes/leads.js
router.get('/', authenticateToken, checkPermissionRead, getLeads)
router.put('/:id', authenticateToken, requireAdmin, updateLead)
router.delete('/:id', authenticateToken, requireAdmin, deleteLead)
router.get('/export/csv', authenticateToken, requireAdmin, exportCSV)
```

## 📊 Banco de Dados

### SQLite em Memória
O sistema utiliza SQLite em memória com seeder automático:

#### Estrutura das Tabelas
```sql
-- Tabela de leads
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cargo TEXT NOT NULL,
  dataNascimento TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Tabela de usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Tabela de permissões
CREATE TABLE permissions (
  role TEXT PRIMARY KEY,
  canRead INTEGER NOT NULL,
  canWrite INTEGER NOT NULL,
  canDelete INTEGER NOT NULL,
  canExport INTEGER NOT NULL,
  canViewAll INTEGER NOT NULL,
  canManageUsers INTEGER NOT NULL
);
```

#### Seeder Automático
```javascript
// seeders/auto-seeder.js
const INITIAL_USERS = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$...', // password
    role: 'admin'
  },
  {
    id: '2',
    username: 'operador',
    password: '$2a$10$...', // password
    role: 'operador'
  }
];

const INITIAL_LEADS = [
  {
    id: uuidv4(),
    nome: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    cargo: "Desenvolvedora Frontend",
    dataNascimento: "1985-05-15",
    mensagem: "Tenho interesse em conhecer mais sobre as oportunidades...",
    tracking: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "vagas_tech",
      utm_term: "desenvolvedor",
      utm_content: "post_vagas",
      gclid: null,
      fbclid: null
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  }
  // ... mais leads
];
```

### Operações de Banco
```javascript
// database/memory-db.js
const sqlite3 = require('sqlite3').verbose();

// Inicializar banco
const initDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Buscar leads
const getLeads = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM leads ORDER BY createdAt DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
```

## 📁 Estrutura do Projeto

```
server/
├── 📁 routes/                   # Rotas da API
│   ├── 🔐 auth.js              # Rotas de autenticação
│   ├── 📊 leads.js             # Rotas de leads
│   └── 🏠 index.js             # Rotas principais
├── 📁 middleware/              # Middlewares
│   ├── 🔐 auth.js              # Autenticação JWT
│   ├── 🛡️ permissions.js       # Sistema de permissões
│   └── 🚨 error-handler.js     # Tratamento de erros
├── 📁 data/                    # Banco JSON
│   ├── 📊 leads.json           # Dados dos leads
│   ├── 👥 users.json           # Dados dos usuários
│   └── 🔐 rolePermissions.json # Permissões por role
├── 📁 database/                # Operações de banco
│   └── 🗄️ index.js            # Funções de banco
├── 📁 schemas/                  # Validações
│   └── ✅ validation.js        # Schemas de validação
├── 📁 utils/                    # Utilitários
│   └── 📡 http-responses.js     # Respostas HTTP padronizadas
├── 📁 config/                   # Configurações
│   └── ⚙️ index.js             # Configurações do servidor
├── 📁 seeders/                  # Seeders
│   └── 🌱 auto-seeder.js       # Seeder automático
├── 📄 aliases.js                # Aliases de módulos
├── 📄 package.json              # Dependências
├── 🚀 index.js                  # Servidor principal
└── 📖 README.md                 # Documentação
```

## 🔧 Desenvolvimento

### Adicionar Nova Rota
1. **Criar arquivo** em `routes/`
2. **Importar** em `index.js`
3. **Adicionar middleware** de autenticação se necessário

```javascript
// routes/novaRota.js
const express = require('express')
const router = express.Router()
const { authenticateToken } = require('@/middleware/auth')

router.get('/', authenticateToken, (req, res) => {
  // Implementação
})

module.exports = router
```

### Adicionar Middleware
1. **Criar arquivo** em `middleware/`
2. **Importar** e usar nas rotas necessárias

```javascript
// middleware/novoMiddleware.js
const novoMiddleware = (req, res, next) => {
  // Implementação
  next()
}

module.exports = { novoMiddleware }
```

### Adicionar Validação
1. **Criar schema** em `schemas/validation.js`
2. **Usar middleware** de validação

```javascript
// schemas/validation.js
const novoSchema = {
  campo: yup.string().required('Campo é obrigatório')
}

module.exports = { novoSchema }
```

## 📝 Validações

### Lead Schema
```javascript
// schemas/validation.js
const leadSchema = {
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail deve ser válido').required('E-mail é obrigatório'),
  telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve ser válido').required('Telefone é obrigatório'),
  cargo: yup.string().required('Cargo é obrigatório'),
  dataNascimento: yup.date().max(new Date(), 'Data deve ser no passado').required('Data de nascimento é obrigatória'),
  mensagem: yup.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').required('Mensagem é obrigatória')
}
```

### Auth Schema
```javascript
// schemas/validation.js
const loginSchema = {
  username: yup.string().min(3, 'Username deve ter pelo menos 3 caracteres').required('Username é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória')
}
```

## 🚀 Deploy

### Deploy Automático com Vercel
```bash
# Deploy para produção
npm run deploy

# Deploy para preview
npm run deploy:preview
```

### Variáveis de Ambiente
```bash
# Produção
NODE_ENV=production
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### Build e Execução
```bash
# Instalar dependências
npm install

# Executar em produção
npm start
```

### Configuração Vercel
- **API Routes** no diretório `api/`
- **Deploy automático** do diretório `server/`
- **Domínio** configurado automaticamente
- **HTTPS** habilitado por padrão

### Docker (Opcional)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔒 Segurança

### Headers de Segurança
```javascript
// index.js
const helmet = require('helmet')

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))
```

### CORS
```javascript
// index.js
const cors = require('cors')

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
```

### Validação de Dados
```javascript
// Todas as entradas são validadas
const { validateSchema } = require('@/schemas/validation')

router.post('/leads', validateSchema(leadSchema), createLead)
```

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

<div align="center">

**🚀 Challenge L0gik - Backend API**

*Desenvolvido com ❤️ usando Node.js e Express.js*

</div>