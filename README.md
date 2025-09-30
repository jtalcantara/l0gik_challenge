# Challenge L0gik - Sistema de Gestão de Leads

Sistema completo de cadastro e gestão de leads com formulário público, API REST e painel administrativo.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework JavaScript reativo
- **Vuetify 3** - Framework Material Design
- **Vue Router** - Roteamento
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados

### Banco de Dados
- **JSON File** - Armazenamento temporário para MVP

## 📋 Funcionalidades

### Formulário Público
- ✅ Campos: nome, e-mail, telefone, cargo, data de nascimento, mensagem
- ✅ Tracking automático: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid
- ✅ Validações: e-mail válido, telefone brasileiro, data válida, campos obrigatórios
- ✅ Interface responsiva com Material Design

### API REST
- ✅ Endpoints para CRUD de leads
- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ Paginação e busca
- ✅ Exportação CSV/Excel

### Painel Administrativo
- ✅ Listar, inserir, editar, deletar leads
- ✅ Visualizar detalhes completos do lead
- ✅ Busca por nome/e-mail
- ✅ Visualização de dados de tracking (UTMs)
- ✅ Autenticação básica
- ✅ Exportação de leads em CSV/Excel

## 📚 Documentação Específica

- **[Frontend (Vue.js)](./client/README.md)** - Documentação do cliente
- **[Backend (Node.js)](./server/README.md)** - Documentação da API

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Instalar dependências
```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar manualmente:
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Executar em modo desenvolvimento
```bash
npm run dev
```

### 3. Executar apenas o backend
```bash
npm run server
# ou
cd server && npm run dev
```

### 4. Executar apenas o frontend
```bash
npm run client
# ou
cd client && npm run dev
```

### 5. Build para produção
```bash
npm run build
npm start
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3000/api
```

### Autenticação
Todos os endpoints administrativos requerem autenticação via JWT no header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Autenticação

**POST /api/auth/login**
- **Descrição**: Realizar login
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```
- **Resposta**:
  ```json
  {
    "success": true,
    "message": "Login realizado com sucesso",
    "data": {
      "token": "jwt_token",
      "user": {
        "id": "1",
        "username": "admin",
        "role": "admin"
      }
    }
  }
  ```

**GET /api/auth/verify**
- **Descrição**: Verificar token
- **Headers**: Authorization: Bearer <token>
- **Resposta**:
  ```json
  {
    "success": true,
    "message": "Token válido"
  }
  ```

#### Leads

**GET /api/leads**
- **Descrição**: Listar leads (requer autenticação)
- **Query Parameters**:
  - `page` (opcional): Número da página (padrão: 1)
  - `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
  - `search` (opcional): Busca por nome ou email
- **Headers**: Authorization: Bearer <token>
- **Resposta**:
  ```json
  {
    "success": true,
    "data": {
      "leads": [...],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "itemsPerPage": 10
      }
    }
  }
  ```

**POST /api/leads**
- **Descrição**: Criar lead (público)
- **Body**:
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
- **Resposta**:
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

**GET /api/leads/:id**
- **Descrição**: Obter lead por ID (requer autenticação)
- **Headers**: Authorization: Bearer <token>
- **Resposta**:
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
      "tracking": {...},
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

**PUT /api/leads/:id**
- **Descrição**: Atualizar lead (requer autenticação e admin)
- **Headers**: Authorization: Bearer <token>
- **Body**: Mesmo formato do POST
- **Resposta**: Lead atualizado

**DELETE /api/leads/:id**
- **Descrição**: Deletar lead (requer autenticação e admin)
- **Headers**: Authorization: Bearer <token>
- **Resposta**:
  ```json
  {
    "success": true,
    "message": "Lead deletado com sucesso",
    "data": {...}
  }
  ```

**GET /api/leads/export/csv**
- **Descrição**: Exportar leads em CSV (requer autenticação e admin)
- **Headers**: Authorization: Bearer <token>
- **Resposta**: Arquivo CSV para download

**GET /api/leads/export/excel**
- **Descrição**: Exportar leads em Excel (requer autenticação e admin)
- **Headers**: Authorization: Bearer <token>
- **Resposta**: Arquivo Excel para download

### Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Não encontrado
- **500**: Erro interno do servidor

### Validações

#### Lead
- **nome**: Obrigatório
- **email**: Obrigatório, formato válido
- **telefone**: Obrigatório, formato brasileiro (XX) XXXXX-XXXX
- **cargo**: Obrigatório
- **dataNascimento**: Obrigatório, data válida
- **mensagem**: Obrigatório

#### Autenticação
- **username**: Obrigatório, mínimo 3 caracteres
- **password**: Obrigatório, mínimo 6 caracteres

## 🔐 Credenciais de Teste

### Administrador
- **Username**: admin
- **Password**: password
- **Permissões**: Acesso total (visualizar, editar, deletar, exportar)

### Operador
- **Username**: operador
- **Password**: password
- **Permissões**: Apenas visualização limitada

## 📁 Estrutura do Projeto

```
challenge_l0gik/
├── client/                 # Frontend Vue.js
│   ├── src/
│   │   ├── components/     # Componentes Vue
│   │   ├── views/         # Páginas
│   │   ├── stores/        # Pinia stores
│   │   ├── router/        # Vue Router
│   │   └── plugins/       # Plugins (Vuetify)
│   ├── package.json       # Dependências do frontend
│   └── vite.config.js
├── server/                # Backend Node.js
│   ├── routes/           # Rotas da API
│   ├── middleware/       # Middlewares
│   ├── data/            # Banco JSON
│   ├── package.json     # Dependências do backend
│   └── index.js         # Servidor principal
├── package.json          # Scripts principais
└── README.md
```

## 🚀 Deploy

### Variáveis de Ambiente
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

### Build para Produção
```bash
npm run build
npm start
```

## 📝 Notas de Desenvolvimento

- O sistema utiliza banco JSON para MVP, mas pode ser facilmente migrado para PostgreSQL/MongoDB
- Todas as validações são feitas tanto no frontend quanto no backend
- O sistema é totalmente responsivo e funciona em dispositivos móveis
- Tracking UTM é capturado automaticamente dos parâmetros da URL
- Exportação funciona tanto em CSV quanto Excel
- Autenticação utiliza JWT com expiração de 24 horas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Challenge L0gik - Sistema de Gestão de Leads
