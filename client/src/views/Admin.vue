<template>
  <div class="login-page">
    <!-- Background com gradiente animado -->
    <div class="background-animation"></div>
    
    <!-- Conteúdo principal -->
    <v-container fluid class="pa-0 full-height">
      <v-row no-gutters class="login-section full-height">
        <!-- Card de login -->
        <v-col cols="12" class="d-flex justify-center pa-6">
          <div class="login-container">
            <v-card elevation="24" class="login-card">
              <v-card-title class="text-center pa-6 pb-4">
                <div class="login-header">
                  <v-icon color="primary" size="32" class="mb-2">mdi-login-variant</v-icon>
                  <h2 class="text-h5 font-weight-medium text-grey-darken-3">Acesso ao Sistema</h2>
                </div>
              </v-card-title>

              <v-card-text class="pa-6 pt-0">
                <v-form ref="form" v-model="valid" @submit.prevent="login">
                  <v-text-field
                    v-model="credentials.username"
                    label="Username"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    class="mb-4"
                    required
                    color="primary"
                  ></v-text-field>

                  <v-text-field
                    v-model="credentials.password"
                    label="Senha"
                    type="password"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    class="mb-6"
                    required
                    color="primary"
                  ></v-text-field>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="isLoading"
                    :disabled="!valid"
                    class="login-btn"
                    elevation="2"
                  >
                    <v-icon left>mdi-login</v-icon>
                    Entrar no Sistema
                  </v-btn>
                </v-form>
              </v-card-text>

              <!-- Alerta de erro -->
              <v-card-text v-if="showError" class="pa-6 pt-0">
                <v-alert
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="showError = false"
                >
                  <v-alert-title>Erro no Login</v-alert-title>
                  <p class="mb-0">{{ errorMessage }}</p>
                </v-alert>
              </v-card-text>

              <!-- Credenciais de teste -->
              <v-card-text class="pa-6 pt-0">
                <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-0"
                >
                  <v-alert-title class="text-body-2">Credenciais de Teste</v-alert-title>
                  <div class="mt-2">
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-caption">Admin:</span>
                      <span class="text-caption font-weight-medium">admin / password</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span class="text-caption">Operador:</span>
                      <span class="text-caption font-weight-medium">operador / password</span>
                    </div>
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
    

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500">
      <v-card>
        <v-card-title class="text-center">
          <v-icon color="success" size="large" class="mr-2">mdi-check-circle</v-icon>
          Login Realizado!
        </v-card-title>
        <v-card-text class="text-center">
          <p class="text-h6 mb-4">Bem-vindo ao painel administrativo!</p>
          <p>Redirecionando para a lista de leads...</p>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Admin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const form = ref(null)
    const valid = ref(false)
    const isLoading = ref(false)
    const successDialog = ref(false)
    const errorMessage = ref('')
    const showError = ref(false)

    const credentials = reactive({
      username: '',
      password: ''
    })

    const rules = {
      required: (value) => !!value || 'Campo obrigatório'
    }

    const login = async () => {
      if (!valid.value) return

      isLoading.value = true
      try {
        const result = await authStore.login(credentials)
        
        if (result.success) {
          successDialog.value = true
          setTimeout(() => {
            router.push('/admin/leads')
          }, 2000)
        } else {
          errorMessage.value = result.message || 'Erro ao fazer login'
          showError.value = true
        }
      } catch (error) {
        errorMessage.value = 'Erro de conexão. Tente novamente.'
        showError.value = true
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      valid,
      isLoading,
      successDialog,
      errorMessage,
      showError,
      credentials,
      rules,
      login
    }
  }
}
</script>

<style scoped>
/* Layout principal */
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

/* Background animado */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: -1;
  opacity: 1;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Seção de login */
.login-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.full-height {
  height: 100vh;
  min-height: 100vh;
}

/* Container do login */
.login-container {
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
}

/* Card de login */
.login-card {
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Header do login */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.logo-container {
  position: relative;
}

.logo-icon {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Botão de login */
.login-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Campos de texto */
.v-text-field {
  margin-bottom: 16px;
}

.v-text-field :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.v-text-field :deep(.v-field):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Alertas */
.v-alert {
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

/* Responsividade */
@media (max-width: 768px) {
  .login-container {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .login-card {
    margin: 0 10px;
  }
  
  .logo-icon {
    font-size: 60px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0 16px;
  }
  
  .login-card {
    margin: 0 5px;
  }
}

/* Garantir que o login ocupe toda a tela */
.v-application {
  height: 100vh;
}

.v-main {
  padding: 0 !important;
}

/* Melhorias gerais */
.v-card-title {
  padding-bottom: 0;
}

.v-card-text {
  padding-top: 0;
}

/* Efeitos de foco */
.v-text-field:focus-within :deep(.v-field) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* Animações suaves */
* {
  transition: all 0.3s ease;
}
</style>
