<template>
  <v-app>
    <!-- Layout completo com cabeçalho e rodapé para outras páginas -->
    <template v-if="!isFormularioRoute && !isLoginRoute">
      <v-app-bar
        color="primary"
        dark
        prominent
        elevation="4"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-toolbar-title>
          <router-link to="/" class="text-decoration-none text-white">
            Challenge L0gik
          </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-if="!authStore.isAuthenticated"
          to="/formulario"
          color="white"
          variant="outlined"
          class="mr-2"
        >
          <v-icon left>mdi-form-select</v-icon>
          Formulário
        </v-btn>

        <v-btn
          v-if="!authStore.isAuthenticated"
          to="/admin"
          color="white"
          variant="outlined"
        >
          <v-icon left>mdi-login</v-icon>
          Login
        </v-btn>

        <v-menu v-if="authStore.isAuthenticated" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              variant="outlined"
              v-bind="props"
            >
              <v-icon left>mdi-account</v-icon>
              {{ authStore.user?.username }}
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item to="/admin/leads">
              <v-list-item-title>
                <v-icon left>mdi-account-group</v-icon>
                Leads
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-icon left>mdi-logout</v-icon>
                Sair
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        temporary
        color="primary"
        dark
      >
        <v-list>
          <v-list-item to="/" prepend-icon="mdi-home">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/formulario" prepend-icon="mdi-form-select">
            <v-list-item-title>Formulário</v-list-item-title>
          </v-list-item>
          
          <v-list-item v-if="authStore.isAuthenticated" to="/admin/leads" prepend-icon="mdi-account-group">
            <v-list-item-title>Leads</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>

      <v-footer
        color="primary"
        dark
        class="text-center footer-limited"
      >
        <v-container>
          <v-row>
            <v-col cols="12">
              <p class="mb-0">
                © 2025 Challenge L0gik - Jonathan Alcantara - Sistema de Gestão de Leads
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </template>

    <!-- Layout isolado para formulário e login -->
    <template v-else>
      <router-view />
    </template>
    
    <!-- Toast Container Global -->
    <ToastContainer />
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'

export default {
  name: 'App',
  components: {
    ToastContainer
  },
  setup() {
    const drawer = ref(false)
    const authStore = useAuthStore()
    const route = useRoute()

    // Detectar se estamos na rota do formulário
    const isFormularioRoute = computed(() => {
      return route.path === '/formulario'
    })

    // Detectar se estamos na rota de login (página inicial)
    const isLoginRoute = computed(() => {
      return route.path === '/'
    })

    const logout = async () => {
      await authStore.logout()
      // Redirecionar para home após logout
      window.location.href = '/'
    }

    return {
      drawer,
      authStore,
      logout,
      isFormularioRoute,
      isLoginRoute
    }
  }
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.text-decoration-none {
  text-decoration: none !important;
}

.footer-limited {
  max-height: 100px !important;
  overflow: hidden;
}

/* Tema escuro global */
.v-application {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  min-height: 100vh;
}

/* Background escuro para todas as páginas */
.v-main {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  min-height: 100vh;
}

/* Cards com tema escuro */
.v-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Forçar cores nos cards específicos */
.v-card.header-card,
.v-card.actions-card,
.v-card.table-card,
.v-card.form-card,
.v-card.info-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Texto claro para contraste - especificidade máxima */
.v-application h1,
.v-application h2,
.v-application h3,
.v-application h4,
.v-application h5,
.v-application h6,
.v-application .text-h1,
.v-application .text-h2,
.v-application .text-h3,
.v-application .text-h4,
.v-application .text-h5,
.v-application .text-h6 {
  color: #ffffff !important;
  font-weight: 600 !important;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Títulos de cards e toolbar - especificidade máxima */
.v-application .v-card-title,
.v-application .v-toolbar-title {
  color: #ffffff !important;
  font-weight: 600 !important;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
}

/* Texto secundário mais claro - especificidade máxima */
.v-application .v-card-text,
.v-application .v-list-item-title,
.v-application .v-list-item-subtitle,
.v-application p,
.v-application span,
.v-application div {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* Texto em labels e campos - especificidade máxima */
.v-application .v-label,
.v-application .v-field__label {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Texto em botões */
.v-btn {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Texto em cards e containers */
.v-card-title,
.v-card-text,
.v-list-item-title {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsividade para títulos */
@media (max-width: 768px) {
  h1, .text-h1 {
    font-size: 1.75rem !important;
    line-height: 1.1 !important;
  }
  
  h2, .text-h2 {
    font-size: 1.5rem !important;
    line-height: 1.1 !important;
  }
  
  h3, .text-h3 {
    font-size: 1.25rem !important;
    line-height: 1.1 !important;
  }
  
  h4, .text-h4 {
    font-size: 1.125rem !important;
    line-height: 1.1 !important;
  }
  
  .v-card-title {
    font-size: 1.125rem !important;
    line-height: 1.1 !important;
  }
}

@media (max-width: 480px) {
  h1, .text-h1 {
    font-size: 1.5rem !important;
  }
  
  h2, .text-h2 {
    font-size: 1.25rem !important;
  }
  
  h3, .text-h3 {
    font-size: 1.125rem !important;
  }
  
  h4, .text-h4 {
    font-size: 1rem !important;
  }
  
  .v-card-title {
    font-size: 1rem !important;
  }
}

/* Flex containers para evitar quebra */
.d-flex {
  flex-wrap: wrap;
  gap: 8px;
}

.d-flex.align-center {
  align-items: center;
}

/* Texto em tabelas */
.v-data-table th,
.v-data-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 200px;
}

/* Texto em formulários */
.v-text-field label,
.v-textarea label {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Texto em alertas */
.v-alert {
  word-wrap: break-word;
  overflow-wrap: break-word;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Formulários com tema escuro - solução global */
.v-text-field,
.v-textarea,
.v-select {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.v-text-field :deep(.v-field),
.v-textarea :deep(.v-field),
.v-select :deep(.v-field) {
  border: none !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  position: relative !important;
  z-index: 1 !important;
}

.v-text-field :deep(.v-field__input),
.v-textarea :deep(.v-field__input),
.v-select :deep(.v-field__input) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
}

.v-text-field :deep(.v-field__prepend-inner),
.v-textarea :deep(.v-field__prepend-inner),
.v-select :deep(.v-field__prepend-inner) {
  background: transparent !important;
  position: absolute !important;
  left: 16px !important;
  z-index: 2 !important;
}

.v-text-field :deep(.v-field__append-inner),
.v-textarea :deep(.v-field__append-inner),
.v-select :deep(.v-field__append-inner) {
  background: transparent !important;
  position: absolute !important;
  right: 16px !important;
  z-index: 2 !important;
}

.v-text-field :deep(.v-messages),
.v-textarea :deep(.v-messages),
.v-select :deep(.v-messages) {
  background: transparent !important;
  margin-top: 4px !important;
  position: relative !important;
  z-index: 0 !important;
}

.v-text-field :deep(.v-messages__message),
.v-textarea :deep(.v-messages__message),
.v-select :deep(.v-messages__message) {
  background: transparent !important;
}

.v-text-field :deep(.v-input__control),
.v-textarea :deep(.v-input__control),
.v-select :deep(.v-input__control) {
  background: transparent !important;
}

.v-text-field :deep(.v-input__details),
.v-textarea :deep(.v-input__details),
.v-select :deep(.v-input__details) {
  background: transparent !important;
}

.v-text-field :deep(.v-field__input),
.v-textarea :deep(.v-field__input) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-text-field :deep(.v-field__outline),
.v-textarea :deep(.v-field__outline) {
  color: rgba(255, 255, 255, 0.3) !important;
}

/* Tabelas com tema escuro */
.v-data-table {
  background: rgba(255, 255, 255, 0.05) !important;
}

.v-data-table th,
.v-data-table td {
  color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Listas com tema escuro */
.v-list {
  background: rgba(255, 255, 255, 0.05) !important;
}

.v-list-item {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-list-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* App bar com tema escuro */
.v-app-bar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-app-bar :deep(.v-toolbar-title) {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.v-app-bar :deep(.v-btn) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-app-bar :deep(.v-btn:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

.v-app-bar :deep(.v-menu) {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

.v-app-bar :deep(.v-list) {
  background: transparent !important;
}

.v-app-bar :deep(.v-list-item) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-app-bar :deep(.v-list-item:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Navigation drawer com tema escuro */
.v-navigation-drawer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-navigation-drawer :deep(.v-list) {
  background: transparent !important;
}

.v-navigation-drawer :deep(.v-list-item) {
  color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px !important;
  margin: 4px 8px !important;
  transition: all 0.3s ease !important;
}

.v-navigation-drawer :deep(.v-list-item:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(4px) !important;
}

.v-navigation-drawer :deep(.v-list-item--active) {
  background: rgba(102, 126, 234, 0.2) !important;
  color: #ffffff !important;
}

.v-navigation-drawer :deep(.v-list-item-title) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500 !important;
}

.v-navigation-drawer :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Footer com tema escuro */
.v-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.v-footer p {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Forçar tema escuro em todas as páginas */
.leads-page,
.lead-detail-page,
.lead-edit-page,
.login-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}

/* Sobrescrever backgrounds específicos das páginas */
.background-animation {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
}

/* Garantir que os cards tenham fundo visível */
.v-card:not(.v-card--flat) {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Forçar cores nos elementos específicos */
.v-card-title,
.v-card-text,
.v-card-actions {
  background: transparent !important;
}

/* Texto em botões mais claro */
.v-btn {
  color: #ffffff !important;
}

.v-btn--variant-text {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Texto em chips e badges */
.v-chip {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Texto em tabelas mais claro */
.v-data-table th,
.v-data-table td {
  color: #ffffff !important;
  font-weight: 500;
}

/* Texto em formulários */
.v-text-field :deep(.v-field__input),
.v-textarea :deep(.v-field__input),
.v-select :deep(.v-field__input) {
  color: #ffffff !important;
}

/* Placeholder mais visível */
.v-text-field :deep(.v-field__placeholder),
.v-textarea :deep(.v-field__placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}


/* Texto em alertas */
.v-alert {
  color: #ffffff !important;
}

.v-alert .v-alert__content {
  color: #ffffff !important;
}

/* Texto em progresso */
.v-progress-circular {
  color: #ffffff !important;
}

/* Texto em ícones */
.v-icon {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Forçar cores em todas as páginas específicas */
.leads-page h1,
.leads-page h2,
.leads-page h3,
.leads-page h4,
.leads-page h5,
.leads-page h6,
.leads-page .text-h1,
.leads-page .text-h2,
.leads-page .text-h3,
.leads-page .text-h4,
.leads-page .text-h5,
.leads-page .text-h6,
.leads-page .v-card-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.lead-detail-page h1,
.lead-detail-page h2,
.lead-detail-page h3,
.lead-detail-page h4,
.lead-detail-page h5,
.lead-detail-page h6,
.lead-detail-page .text-h1,
.lead-detail-page .text-h2,
.lead-detail-page .text-h3,
.lead-detail-page .text-h4,
.lead-detail-page .text-h5,
.lead-detail-page .text-h6,
.lead-detail-page .v-card-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.lead-edit-page h1,
.lead-edit-page h2,
.lead-edit-page h3,
.lead-edit-page h4,
.lead-edit-page h5,
.lead-edit-page h6,
.lead-edit-page .text-h1,
.lead-edit-page .text-h2,
.lead-edit-page .text-h3,
.lead-edit-page .text-h4,
.lead-edit-page .text-h5,
.lead-edit-page .text-h6,
.lead-edit-page .v-card-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.login-page h1,
.login-page h2,
.login-page h3,
.login-page h4,
.login-page h5,
.login-page h6,
.login-page .text-h1,
.login-page .text-h2,
.login-page .text-h3,
.login-page .text-h4,
.login-page .text-h5,
.login-page .text-h6,
.login-page .v-card-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* Forçar cores em todos os textos das páginas */
.leads-page .v-card-text,
.leads-page .v-list-item-title,
.leads-page .v-list-item-subtitle,
.leads-page p,
.leads-page span,
.leads-page div,
.lead-detail-page .v-card-text,
.lead-detail-page .v-list-item-title,
.lead-detail-page .v-list-item-subtitle,
.lead-detail-page p,
.lead-detail-page span,
.lead-detail-page div,
.lead-edit-page .v-card-text,
.lead-edit-page .v-list-item-title,
.lead-edit-page .v-list-item-subtitle,
.lead-edit-page p,
.lead-edit-page span,
.lead-edit-page div,
.login-page .v-card-text,
.login-page .v-list-item-title,
.login-page .v-list-item-subtitle,
.login-page p,
.login-page span,
.login-page div {
  color: rgba(255, 255, 255, 0.95) !important;
}
</style>
