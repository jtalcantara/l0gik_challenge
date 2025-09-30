<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters class="login-section">
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-8">
        <div class="text-center">
          <h1 class="text-h3 font-weight-bold mb-4 text-white">
            Painel Administrativo
          </h1>
          <p class="text-h6 text-white mb-6">
            Acesse o sistema para gerenciar leads e visualizar relatórios
          </p>
          <v-icon size="120" color="white" class="mb-4">mdi-shield-account</v-icon>
        </div>
      </v-col>
      
      <v-col cols="12" md="6" class="pa-8">
        <v-card elevation="8" class="pa-6">
          <v-card-title class="text-h4 text-center mb-6">
            <v-icon color="primary" size="large" class="mr-2">mdi-login</v-icon>
            Login
          </v-card-title>

          <v-form ref="form" v-model="valid" @submit.prevent="login">
            <v-text-field
              v-model="credentials.username"
              label="Username"
              :rules="[rules.required]"
              prepend-icon="mdi-account"
              variant="outlined"
              required
            ></v-text-field>

            <v-text-field
              v-model="credentials.password"
              label="Senha"
              type="password"
              :rules="[rules.required]"
              prepend-icon="mdi-lock"
              variant="outlined"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isLoading"
              :disabled="!valid"
              class="text-h6 py-3"
            >
              <v-icon left>mdi-login</v-icon>
              Entrar
            </v-btn>
          </v-form>

          <v-divider class="my-6"></v-divider>

          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            <v-alert-title>Credenciais de Teste</v-alert-title>
            <p class="mb-0">
              <strong>Username:</strong> admin<br>
              <strong>Senha:</strong> password
            </p>
          </v-alert>

          <v-btn
            to="/"
            color="secondary"
            variant="outlined"
            block
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Voltar ao Início
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

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
  </v-container>
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
          console.error('Erro no login:', result.message)
        }
      } catch (error) {
        console.error('Erro no login:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      valid,
      isLoading,
      successDialog,
      credentials,
      rules,
      login
    }
  }
}
</script>

<style scoped>
.login-section {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
}

.v-btn {
  border-radius: 8px;
}
</style>
