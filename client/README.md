# Challenge L0gik - Frontend

Interface web responsiva para sistema de gestão de leads desenvolvida em Vue.js 3 com Vuetify.

## 🚀 Tecnologias

- **Vue.js 3** - Framework JavaScript reativo
- **Vuetify 3** - Framework Material Design
- **Vue Router** - Roteamento
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento (porta 5173)
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm install` - Instala dependências

## 🎨 Funcionalidades

### Páginas
- **Home** (`/`) - Página inicial com informações do sistema
- **Formulário** (`/formulario`) - Cadastro público de leads
- **Admin** (`/admin`) - Login administrativo
- **Leads** (`/admin/leads`) - Lista de leads (requer autenticação)
- **Detalhes** (`/admin/leads/:id`) - Detalhes do lead
- **Edição** (`/admin/leads/:id/edit`) - Editar lead

### Componentes
- **Formulário Responsivo** - Cadastro com validações
- **Tabela de Leads** - Listagem com paginação e busca
- **Detalhes do Lead** - Visualização completa
- **Formulário de Edição** - Edição de dados

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no localStorage e enviado automaticamente nas requisições.

### Store de Autenticação
```javascript
// stores/auth.js
const authStore = useAuthStore()

// Login
await authStore.login({ username, password })

// Logout
await authStore.logout()

// Verificar autenticação
authStore.isAuthenticated
```

## 📊 Gerenciamento de Estado

### Store de Leads
```javascript
// stores/leads.js
const leadsStore = useLeadsStore()

// Buscar leads
await leadsStore.fetchLeads(page, limit, search)

// Criar lead
await leadsStore.createLead(leadData)

// Atualizar lead
await leadsStore.updateLead(id, leadData)

// Deletar lead
await leadsStore.deleteLead(id)

// Exportar leads
await leadsStore.exportLeads('csv')
```

## 🎯 Validações

### Formulário Público
- **Nome**: Obrigatório
- **Email**: Obrigatório, formato válido
- **Telefone**: Obrigatório, formato brasileiro (XX) XXXXX-XXXX
- **Cargo**: Obrigatório
- **Data de Nascimento**: Obrigatório, data válida
- **Mensagem**: Obrigatório

### Tracking UTM
Captura automática dos parâmetros da URL:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `gclid`
- `fbclid`

## 🎨 Interface

### Design System
- **Material Design** com Vuetify 3
- **Responsivo** para todos os dispositivos
- **Tema personalizado** com cores da marca
- **Ícones** Material Design Icons

### Componentes Principais
- **v-app** - Aplicação principal
- **v-app-bar** - Barra de navegação
- **v-navigation-drawer** - Menu lateral
- **v-data-table** - Tabela de dados
- **v-form** - Formulários
- **v-dialog** - Modais

## 🚀 Build e Deploy

### Desenvolvimento
```bash
npm run dev
# Servidor: http://localhost:5173
```

### Produção
```bash
npm run build
# Arquivos gerados em dist/
```

### Variáveis de Ambiente
```bash
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estrutura

```
client/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── views/         # Páginas da aplicação
│   │   ├── admin/     # Páginas administrativas
│   │   ├── Home.vue   # Página inicial
│   │   └── Formulario.vue # Formulário público
│   ├── stores/        # Pinia stores
│   │   ├── auth.js    # Autenticação
│   │   └── leads.js   # Gestão de leads
│   ├── router/        # Vue Router
│   │   └── index.js   # Configuração de rotas
│   ├── plugins/       # Plugins
│   │   └── vuetify.js # Configuração Vuetify
│   ├── directives/    # Diretivas customizadas
│   │   └── mask.js    # Máscara de telefone
│   ├── App.vue        # Componente raiz
│   └── main.js        # Ponto de entrada
├── public/            # Arquivos estáticos
├── package.json       # Dependências
├── vite.config.js     # Configuração Vite
└── README.md          # Documentação
```

## 🔧 Desenvolvimento

### Adicionar Nova Página
1. Criar arquivo em `src/views/`
2. Adicionar rota em `src/router/index.js`
3. Implementar componente

### Adicionar Novo Store
1. Criar arquivo em `src/stores/`
2. Usar `defineStore` do Pinia
3. Importar onde necessário

### Adicionar Componente
1. Criar arquivo em `src/components/`
2. Importar onde necessário
3. Registrar globalmente se reutilizável

## 🎨 Customização

### Tema
```javascript
// plugins/vuetify.js
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          // ...
        },
      },
    },
  },
})
```

### Cores Personalizadas
- **Primary**: #1976D2 (Azul)
- **Secondary**: #424242 (Cinza)
- **Success**: #4CAF50 (Verde)
- **Warning**: #FFC107 (Amarelo)
- **Error**: #FF5252 (Vermelho)

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **xs**: < 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1264px (Desktop)
- **lg**: 1264px - 1904px (Large)
- **xl**: > 1904px (Extra Large)

## 🔧 Configuração

### Vite
```javascript
// vite.config.js
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

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa no README principal do projeto.
