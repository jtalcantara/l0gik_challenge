# 🎨 Challenge L0gik - Frontend

Interface web responsiva para sistema de gestão de leads desenvolvida em Vue.js 3 com Vuetify 3.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Desenvolvimento](#-desenvolvimento)
- [Configuração](#-configuração)
- [Deploy](#-deploy)

## 🎯 Visão Geral

O frontend do Challenge L0gik é uma aplicação SPA (Single Page Application) desenvolvida com Vue.js 3 que oferece:

- **Formulário público** para captura de leads
- **Painel administrativo** completo para gestão
- **Interface responsiva** com Material Design
- **Autenticação JWT** integrada
- **Gerenciamento de estado** com Pinia

### 🌐 URLs da Aplicação

- **Home**: http://localhost:5173/
- **Formulário**: http://localhost:5173/formulario
- **Login**: http://localhost:5173/admin
- **Leads**: http://localhost:5173/admin/leads

## 🛠️ Tecnologias

### Core
- **Vue.js 3** - Framework JavaScript reativo
- **Vue Router 4** - Roteamento SPA
- **Pinia** - Gerenciamento de estado
- **Vite** - Build tool moderno

### UI/UX
- **Vuetify 3** - Framework Material Design
- **Material Design Icons** - Ícones
- **Sass** - Pré-processador CSS

### HTTP & Utils
- **Axios** - Cliente HTTP
- **Máscaras customizadas** - Formatação de campos

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

### 3. Build para produção
```bash
npm run build
```

### 4. Preview da build
```bash
npm run preview
```

## 🔧 Scripts Disponíveis

| Script | Descrição | Porta |
|--------|-----------|-------|
| `npm run dev` | Servidor de desenvolvimento | 5173 |
| `npm run build` | Build para produção | - |
| `npm run preview` | Preview da build | 4173 |
| `npm install` | Instalar dependências | - |

## ✨ Funcionalidades

### 🏠 Páginas da Aplicação

#### Página Inicial (`/`)
- **Descrição**: Landing page com informações do sistema
- **Acesso**: Público
- **Funcionalidades**: Navegação para formulário e login

#### Formulário Público (`/formulario`)
- **Descrição**: Cadastro público de leads
- **Acesso**: Público
- **Funcionalidades**:
  - ✅ Formulário responsivo com validações
  - ✅ Máscara automática para telefone
  - ✅ Captura automática de parâmetros UTM
  - ✅ Validação em tempo real
  - ✅ Feedback visual de sucesso/erro

#### Login Administrativo (`/admin`)
- **Descrição**: Página de login para administradores
- **Acesso**: Público (apenas login)
- **Funcionalidades**:
  - ✅ Formulário de login
  - ✅ Validação de credenciais
  - ✅ Redirecionamento automático após login

#### Lista de Leads (`/admin/leads`)
- **Descrição**: Gestão completa dos leads
- **Acesso**: Autenticado
- **Funcionalidades**:
  - ✅ Tabela responsiva com paginação
  - ✅ Busca por nome/e-mail
  - ✅ Ações: visualizar, editar, deletar
  - ✅ Exportação CSV
  - ✅ Filtros avançados

#### Detalhes do Lead (`/admin/leads/:id`)
- **Descrição**: Visualização completa do lead
- **Acesso**: Autenticado
- **Funcionalidades**:
  - ✅ Dados pessoais completos
  - ✅ Dados de tracking UTM
  - ✅ Histórico de alterações
  - ✅ Ações: editar, deletar

#### Edição do Lead (`/admin/leads/:id/edit`)
- **Descrição**: Edição de dados do lead
- **Acesso**: Autenticado + Admin
- **Funcionalidades**:
  - ✅ Formulário de edição
  - ✅ Validações completas
  - ✅ Salvamento automático
  - ✅ Cancelamento com confirmação

### 🧩 Componentes Principais

#### Layout Components
- **App.vue** - Componente raiz com layout condicional
- **Navigation** - Barra de navegação responsiva
- **Sidebar** - Menu lateral com navegação

#### Form Components
- **LeadForm** - Formulário de cadastro/edição
- **LoginForm** - Formulário de autenticação
- **SearchForm** - Busca e filtros

#### Data Components
- **LeadsTable** - Tabela de leads com paginação
- **LeadCard** - Card de visualização do lead
- **ExportButtons** - Botões de exportação

## 📁 Estrutura do Projeto

```
client/
├── 📁 public/                    # Arquivos estáticos
│   └── 🖼️ favicon.ico             # Favicon
├── 📁 src/
│   ├── 📁 components/            # Componentes reutilizáveis
│   ├── 📁 views/                 # Páginas da aplicação
│   │   ├── 📁 admin/             # Páginas administrativas
│   │   │   ├── 📊 LeadsList.vue      # Lista de leads
│   │   │   ├── 👁️ LeadDetail.vue     # Detalhes do lead
│   │   │   └── ✏️ LeadEdit.vue       # Edição do lead
│   │   ├── 🏠 Home.vue           # Página inicial
│   │   ├── 📝 Formulario.vue    # Formulário público
│   │   └── 🔐 Admin.vue         # Login administrativo
│   ├── 📁 stores/                # Pinia stores
│   │   ├── 🔐 auth.js           # Store de autenticação
│   │   └── 📊 leads.js          # Store de leads
│   ├── 📁 router/                # Vue Router
│   │   └── 🛣️ index.js          # Configuração de rotas
│   ├── 📁 plugins/                # Plugins
│   │   └── 🎨 vuetify.js        # Configuração Vuetify
│   ├── 📁 directives/            # Diretivas customizadas
│   │   └── 🎭 mask.js           # Máscara de telefone
│   ├── 📁 config/                # Configurações
│   │   ├── 🌐 axios.js          # Configuração HTTP
│   │   └── 🔧 env.js            # Variáveis de ambiente
│   ├── 🎨 App.vue               # Componente raiz
│   └── 🚀 main.js               # Ponto de entrada
├── 📄 index.html                # Template HTML
├── 📄 package.json              # Dependências
├── ⚙️ vite.config.js            # Configuração Vite
└── 📖 README.md                 # Documentação
```

## 🔐 Autenticação

### Store de Autenticação
```javascript
// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials) {
      // Implementação do login
    },
    
    async logout() {
      // Implementação do logout
    },
    
    async verifyToken() {
      // Verificação do token
    }
  }
})
```

### Uso nos Componentes
```javascript
// Em qualquer componente Vue
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    
    // Login
    await authStore.login({ username, password })
    
    // Logout
    await authStore.logout()
    
    // Verificar autenticação
    const isAuth = authStore.isAuthenticated
  }
}
```

## 📊 Gerenciamento de Estado

### Store de Leads
```javascript
// stores/leads.js
import { defineStore } from 'pinia'

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    leads: [],
    currentLead: null,
    pagination: {},
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchLeads(page = 1, limit = 10, search = '') {
      // Buscar leads com paginação
    },
    
    async createLead(leadData) {
      // Criar novo lead
    },
    
    async updateLead(id, leadData) {
      // Atualizar lead existente
    },
    
    async deleteLead(id) {
      // Deletar lead
    },
    
    async exportLeads(format) {
      // Exportar leads (CSV/Excel)
    }
  }
})
```

### Uso nos Componentes
```javascript
// Em qualquer componente Vue
import { useLeadsStore } from '@/stores/leads'

export default {
  setup() {
    const leadsStore = useLeadsStore()
    
    // Buscar leads
    await leadsStore.fetchLeads(1, 10, 'busca')
    
    // Criar lead
    await leadsStore.createLead(leadData)
    
    // Acessar estado
    const leads = leadsStore.leads
    const loading = leadsStore.loading
  }
}
```

## 🎯 Validações

### Formulário Público
```javascript
// Validações implementadas
const rules = {
  nome: [
    v => !!v || 'Nome é obrigatório',
    v => v.length >= 2 || 'Nome deve ter pelo menos 2 caracteres'
  ],
  email: [
    v => !!v || 'E-mail é obrigatório',
    v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
  ],
  telefone: [
    v => !!v || 'Telefone é obrigatório',
    v => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) || 'Telefone deve ser válido'
  ],
  cargo: [
    v => !!v || 'Cargo é obrigatório'
  ],
  dataNascimento: [
    v => !!v || 'Data de nascimento é obrigatória',
    v => new Date(v) < new Date() || 'Data deve ser no passado'
  ],
  mensagem: [
    v => !!v || 'Mensagem é obrigatória',
    v => v.length >= 10 || 'Mensagem deve ter pelo menos 10 caracteres'
  ]
}
```

### Tracking UTM
```javascript
// Captura automática de parâmetros UTM
const captureUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_term: urlParams.get('utm_term') || '',
    utm_content: urlParams.get('utm_content') || '',
    gclid: urlParams.get('gclid') || '',
    fbclid: urlParams.get('fbclid') || ''
  }
}
```

## 🎨 Interface e Design

### Design System
- **Material Design 3** com Vuetify
- **Responsivo** para todos os dispositivos
- **Tema personalizado** com cores da marca
- **Ícones** Material Design Icons
- **Tipografia** Roboto (padrão Material)

### Componentes Vuetify Utilizados
```javascript
// Componentes principais
<v-app>              // Aplicação principal
<v-app-bar>          // Barra de navegação
<v-navigation-drawer> // Menu lateral
<v-main>             // Conteúdo principal
<v-container>        // Container responsivo
<v-row>              // Linha do grid
<v-col>              // Coluna do grid
<v-card>             // Card de conteúdo
<v-data-table>       // Tabela de dados
<v-form>             // Formulário
<v-text-field>      // Campo de texto
<v-btn>              // Botão
<v-dialog>           // Modal
<v-snackbar>         // Notificação
```

### Cores Personalizadas
```javascript
// plugins/vuetify.js
const theme = {
  light: {
    colors: {
      primary: '#1976D2',      // Azul principal
      secondary: '#424242',    // Cinza secundário
      success: '#4CAF50',      // Verde sucesso
      warning: '#FFC107',      // Amarelo aviso
      error: '#FF5252',        // Vermelho erro
      info: '#2196F3'          // Azul informação
    }
  }
}
```

## 📱 Responsividade

### Breakpoints Vuetify
```javascript
// Breakpoints utilizados
const breakpoints = {
  xs: '< 600px',      // Mobile
  sm: '600px - 960px', // Tablet
  md: '960px - 1264px', // Desktop
  lg: '1264px - 1904px', // Large
  xl: '> 1904px'      // Extra Large
}
```

### Grid System
```vue
<!-- Exemplo de grid responsivo -->
<v-container>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <!-- Conteúdo -->
    </v-col>
  </v-row>
</v-container>
```

## ⚙️ Configuração

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

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

### Axios Configuration
```javascript
// src/config/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
})

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Environment Variables
```bash
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=Challenge L0gik
```

## 🚀 Deploy

### Build para Produção
```bash
# Build do projeto
npm run build

# Arquivos gerados em dist/
# Servir com servidor web (nginx, apache, etc.)
```

### Variáveis de Ambiente
```bash
# Produção
VITE_API_URL=https://api.exemplo.com/api
VITE_APP_TITLE=Challenge L0gik
```

### Estrutura de Deploy
```
dist/
├── 📁 assets/          # Assets compilados
│   ├── 📄 index.js     # JavaScript principal
│   └── 📄 style.css    # CSS compilado
├── 📄 index.html       # HTML principal
└── 🖼️ favicon.ico      # Favicon
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de CORS
```javascript
// Verificar configuração do proxy no vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

#### Erro de Autenticação
```javascript
// Verificar se o token está sendo enviado
const token = localStorage.getItem('token')
if (!token) {
  // Redirecionar para login
}
```

#### Problemas de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

---

<div align="center">

**🎨 Challenge L0gik - Frontend**

*Desenvolvido com ❤️ usando Vue.js 3 e Vuetify 3*

</div>