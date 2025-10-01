# 🚀 Challenge L0gik - Sistema de Gestão de Leads

Sistema completo de cadastro e gestão de leads com formulário público, API REST e painel administrativo desenvolvido com Vue.js 3 e Node.js.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Instalação Rápida](#-instalação-rápida)
- [Documentação Detalhada](#-documentação-detalhada)
- [API Reference](#-api-reference)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O Challenge L0gik é um sistema completo de gestão de leads que permite:

- **Formulário público** para captura de leads com tracking UTM automático
- **API REST** robusta com autenticação JWT e sistema de permissões
- **Painel administrativo** responsivo para gestão completa dos leads
- **Exportação de dados** em CSV
- **Sistema de permissões** granular (Admin/Operador)

### 🎨 Demonstração

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api
- **Formulário Público**: http://localhost:5173/formulario
- **Painel Admin**: http://localhost:5173/admin

## 🛠️ Tecnologias

### Frontend
- **Vue.js 3** - Framework JavaScript reativo
- **Vuetify 3** - Framework Material Design
- **Vue Router** - Roteamento SPA
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Vite** - Build tool moderno

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **Helmet** - Headers de segurança
- **CORS** - Controle de origem

### Banco de Dados
- **JSON Files** - Armazenamento temporário para MVP
- **Estrutura preparada** para migração para PostgreSQL/MongoDB

## ✨ Funcionalidades

### 📝 Formulário Público
- ✅ **Campos completos**: nome, e-mail, telefone, cargo, data de nascimento, mensagem
- ✅ **Tracking automático**: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid
- ✅ **Validações robustas**: e-mail válido, telefone brasileiro, data válida
- ✅ **Interface responsiva** com Material Design
- ✅ **Máscaras automáticas** para telefone

### 🔐 Sistema de Autenticação
- ✅ **JWT** com expiração de 24 horas
- ✅ **Sistema de permissões** granular
- ✅ **Roles**: Admin (acesso total) e Operador (visualização limitada)
- ✅ **Proteção de rotas** no frontend e backend

### 📊 Painel Administrativo
- ✅ **CRUD completo** de leads
- ✅ **Busca e paginação** avançadas
- ✅ **Visualização detalhada** com dados de tracking
- ✅ **Exportação** em CSV
- ✅ **Interface responsiva** para mobile/tablet/desktop

### 🛡️ Segurança
- ✅ **Headers de segurança** com Helmet
- ✅ **Validação de dados** no frontend e backend
- ✅ **Controle de acesso** por permissões
- ✅ **Hash de senhas** com Bcrypt

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd challenge_l0gik
```

### 2. Instale as dependências
```bash
# Instalar dependências de todos os projetos
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Execute o projeto
```bash
# Volte para a raiz do projeto
cd ..

# Execute o backend (terminal 1)
cd server && npm run dev

# Execute o frontend (terminal 2)
cd client && npm run dev
```

### 4. Acesse o sistema
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api

## 📚 Documentação Detalhada

### Frontend (Vue.js)
- **[README do Frontend](./client/README.md)** - Documentação completa do cliente
- **Tecnologias**: Vue.js 3, Vuetify 3, Pinia, Vue Router
- **Funcionalidades**: Formulário público, painel admin, autenticação

### Backend (Node.js)
- **[README do Backend](./server/README.md)** - Documentação completa da API
- **Tecnologias**: Node.js, Express.js, JWT, Bcrypt
- **Funcionalidades**: API REST, autenticação, sistema de permissões

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### Autenticação
Todos os endpoints administrativos requerem token JWT:
```
Authorization: Bearer <token>
```

### Endpoints Principais

#### 🔐 Autenticação
- `POST /api/auth/login` - Realizar login
- `POST /api/auth/register` - Registrar usuário (admin)
- `GET /api/auth/verify` - Verificar token

#### 📊 Leads
- `GET /api/leads` - Listar leads (requer autenticação)
- `POST /api/leads` - Criar lead (público)
- `GET /api/leads/:id` - Obter lead por ID
- `PATCH /api/leads/:id` - Atualizar lead (admin)
- `DELETE /api/leads/:id` - Deletar lead (admin)
- `GET /api/leads/export/csv` - Exportar CSV (admin)
- `GET /api/leads/limited` - Listar leads com dados limitados (operador)
- `GET /api/leads/limited/:id` - Obter lead limitado por ID (operador)

### Credenciais de Teste

#### 👨‍💼 Administrador
- **Username**: `admin`
- **Password**: `password`
- **Permissões**: Acesso total (visualizar, editar, deletar, exportar)

#### 👨‍💻 Operador
- **Username**: `operador`
- **Password**: `password`
- **Permissões**: Apenas visualização limitada

## 📁 Estrutura do Projeto

```
challenge_l0gik/
├── 📁 client/                    # Frontend Vue.js
│   ├── 📁 src/
│   │   ├── 📁 views/            # Páginas da aplicação
│   │   │   ├── 📁 admin/        # Páginas administrativas
│   │   │   ├── 🏠 Home.vue      # Página inicial
│   │   │   └── 📝 Formulario.vue # Formulário público
│   │   ├── 📁 stores/           # Pinia stores
│   │   │   ├── 🔐 auth.js       # Autenticação
│   │   │   └── 📊 leads.js      # Gestão de leads
│   │   ├── 📁 router/           # Vue Router
│   │   ├── 📁 plugins/          # Plugins (Vuetify)
│   │   └── 📁 directives/       # Diretivas customizadas
│   ├── 📄 package.json          # Dependências frontend
│   └── ⚙️ vite.config.js         # Configuração Vite
├── 📁 server/                    # Backend Node.js
│   ├── 📁 routes/               # Rotas da API
│   │   ├── 🔐 auth.js           # Autenticação
│   │   └── 📊 leads.js          # CRUD de leads
│   ├── 📁 middleware/           # Middlewares
│   │   ├── 🔐 auth.js           # Autenticação JWT
│   │   └── 🛡️ permissions.js    # Sistema de permissões
│   ├── 📁 data/                 # Banco JSON
│   │   ├── 📊 leads.json        # Dados dos leads
│   │   ├── 👥 users.json        # Dados dos usuários
│   │   └── 🔐 rolePermissions.json # Permissões
│   ├── 📁 utils/                # Utilitários
│   ├── 📁 schemas/              # Validações
│   ├── 📄 package.json          # Dependências backend
│   └── 🚀 index.js              # Servidor principal
└── 📄 README.md                 # Documentação principal
```

## 🚀 Deploy

### Variáveis de Ambiente
```bash
# Backend
NODE_ENV=production
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui

# Frontend
VITE_API_URL=http://localhost:3000/api
```

### Build para Produção
```bash
# Build do frontend
cd client && npm run build

# Executar backend
cd server && npm start
```

### Scripts Disponíveis

#### Raiz do Projeto
```bash
npm run dev          # Executar frontend e backend
npm run client       # Executar apenas frontend
npm run server       # Executar apenas backend
npm run build        # Build para produção
npm start            # Executar em produção
```

#### Frontend (client/)
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
```

#### Backend (server/)
```bash
npm run dev          # Executar com nodemon
npm start            # Executar em produção
```

### Estrutura de Dados

#### Lead Exemplo
```json
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
```

## 🛡️ Sistema de Permissões

### Roles e Permissões

#### 👨‍💼 Admin
- ✅ Visualizar todos os dados dos leads
- ✅ Editar leads
- ✅ Deletar leads
- ✅ Exportar dados (CSV)
- ✅ Gerenciar usuários

#### 👨‍💻 Operador
- ✅ Visualizar dados limitados dos leads
- ❌ Não pode ver: data de nascimento, mensagem, dados de tracking
- ❌ Não pode editar leads
- ❌ Não pode deletar leads
- ❌ Não pode exportar dados

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **📱 Mobile**: < 600px
- **📱 Tablet**: 600px - 960px
- **💻 Desktop**: 960px - 1264px
- **🖥️ Large**: 1264px - 1904px
- **🖥️ Extra Large**: > 1904px

## 🔧 Configuração Avançada

### Personalização do Tema
```javascript
// client/src/plugins/vuetify.js
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          success: '#4CAF50',
          warning: '#FFC107',
          error: '#FF5252'
        }
      }
    }
  }
})
```

### Configuração do Vite
```javascript
// client/vite.config.js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Frontend não conecta com API
- Verifique se o backend está rodando na porta 3000
- Confirme a configuração do proxy no `vite.config.js`

#### Erro de autenticação
- Verifique se o token JWT está sendo enviado corretamente
- Confirme se o usuário tem as permissões necessárias

#### Problemas de build
- Limpe o cache: `npm run clean` (se disponível)
- Reinstale as dependências: `rm -rf node_modules && npm install`

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código
- Use **ESLint** e **Prettier** para formatação
- Siga as convenções do **Vue.js 3** e **Node.js**
- Escreva **testes** para novas funcionalidades
- Documente mudanças na **API**

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Challenge L0gik** - Sistema de Gestão de Leads
- **Desenvolvedor**: Jonathan Alcantara
- **Tecnologias**: Vue.js 3, Node.js, Express.js

---

<div align="center">

**🚀 Challenge L0gik - Sistema de Gestão de Leads**

*Desenvolvido com ❤️ usando Vue.js 3 e Node.js*

</div>