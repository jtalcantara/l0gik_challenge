# Challenge L0gik - Backend API

API REST para sistema de gestão de leads desenvolvida em Node.js com Express.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados
- **CSV Writer** - Exportação CSV
- **XLSX** - Exportação Excel

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa com nodemon (desenvolvimento)
- `npm start` - Executa em produção
- `npm install` - Instala dependências

## 🌐 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

### Autenticação

**POST /api/auth/login**
```json
{
  "username": "admin",
  "password": "password"
}
```

**GET /api/auth/verify**
- Headers: `Authorization: Bearer <token>`

### Leads

**GET /api/leads** - Listar leads (requer autenticação)
- Query: `page`, `limit`, `search`

**POST /api/leads** - Criar lead (público)
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cargo": "Desenvolvedor",
  "dataNascimento": "1990-01-01",
  "mensagem": "Interesse no produto",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "campanha_2024",
  "utm_term": "desenvolvimento",
  "utm_content": "banner_principal",
  "gclid": "abc123",
  "fbclid": "def456"
}
```

**GET /api/leads/:id** - Obter lead por ID (requer autenticação)

**PUT /api/leads/:id** - Atualizar lead (requer autenticação + admin)

**DELETE /api/leads/:id** - Deletar lead (requer autenticação + admin)

**GET /api/leads/export/csv** - Exportar CSV (requer autenticação + admin)

**GET /api/leads/export/excel** - Exportar Excel (requer autenticação + admin)

## 🔐 Autenticação

Todos os endpoints administrativos requerem token JWT no header:
```
Authorization: Bearer <token>
```

## 📊 Banco de Dados

O sistema utiliza arquivos JSON separados para armazenamento temporário:

- `data/leads.json` - Dados dos leads
- `data/users.json` - Dados dos usuários
- `data/rolePermissions.json` - Permissões por role

### Estrutura dos Arquivos

**data/leads.json:**
```json
{
  "leads": [...]
}
```

**data/users.json:**
```json
[
  {
    "id": "1",
    "username": "admin",
    "password": "$2a$10$...",
    "role": "admin"
  }
]
```

**data/rolePermissions.json:**
```json
{
  "admin": {
    "canRead": true,
    "canWrite": true,
    "canDelete": true,
    "canExport": true,
    "canViewAll": true,
    "canManageUsers": true
  },
  "operador": {
    "canRead": true,
    "canWrite": false,
    "canDelete": false,
    "canExport": false,
    "canViewAll": false,
    "canManageUsers": false
  }
}
```

## 🛡️ Segurança

- **Helmet** - Headers de segurança
- **CORS** - Controle de origem
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de entrada
- **Sistema de Permissões** - Controle granular de acesso

### Sistema de Permissões

O sistema possui diferentes níveis de permissão:

#### Roles (Funções)
- **admin**: Acesso total (read, write, delete, export, manage_users, view_all)
- **operador**: Acesso limitado (read, view_limited) - apenas visualização

#### Middlewares de Permissão
- `requireAdmin` - Apenas administradores
- `requireOperador` - Apenas operadores
- `requireAdminOrOperador` - Admin ou operador
- `requirePermission(permission)` - Permissão específica
- `requireAllPermissions([...])` - Todas as permissões necessárias
- `requireAnyPermission([...])` - Qualquer uma das permissões
- `requireOwnerOrAdmin` - Proprietário do recurso ou admin

#### Diferenças de Acesso

**Admin:**
- ✅ Visualizar todos os dados dos leads
- ✅ Editar leads
- ✅ Deletar leads
- ✅ Exportar dados (CSV/Excel)
- ✅ Gerenciar usuários

**Operador:**
- ✅ Visualizar dados limitados dos leads (nome, email, telefone, cargo, data de cadastro)
- ❌ Não pode ver: data de nascimento, mensagem, dados de tracking
- ❌ Não pode editar leads
- ❌ Não pode deletar leads
- ❌ Não pode exportar dados

## 📝 Validações

### Lead
- **nome**: Obrigatório
- **email**: Obrigatório, formato válido
- **telefone**: Obrigatório, formato brasileiro (XX) XXXXX-XXXX
- **cargo**: Obrigatório
- **dataNascimento**: Obrigatório, data válida
- **mensagem**: Obrigatório

## 🚀 Deploy

### Variáveis de Ambiente
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### Build
```bash
npm start
```

## 📁 Estrutura

```
server/
├── routes/          # Rotas da API
│   ├── auth.js      # Autenticação
│   └── leads.js     # CRUD de leads
├── middleware/      # Middlewares
│   └── auth.js      # Autenticação JWT
├── data/                    # Banco JSON
│   ├── leads.json           # Dados dos leads
│   ├── users.json           # Dados dos usuários
│   └── rolePermissions.json # Permissões dos usuarios
├── package.json     # Dependências
├── .gitignore       # Arquivos ignorados
└── index.js         # Servidor principal
```

## 🔧 Desenvolvimento

### Adicionar Nova Rota
1. Criar arquivo em `routes/`
2. Importar em `index.js`
3. Adicionar middleware de autenticação se necessário

### Adicionar Middleware
1. Criar arquivo em `middleware/`
2. Importar e usar nas rotas necessárias

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa no README principal do projeto.
