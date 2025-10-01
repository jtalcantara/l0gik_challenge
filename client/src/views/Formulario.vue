<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-row no-gutters class="hero-section">
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-8">
        <div class="text-center">
          <h1 class="text-h3 font-weight-bold mb-4 text-white">
            Cadastre-se e Transforme seu Negócio
          </h1>
          <p class="text-h6 text-white mb-6">
            Preencha o formulário abaixo e receba informações exclusivas sobre nossos produtos e serviços.
          </p>
          <v-chip
            v-for="benefit in benefits"
            :key="benefit"
            color="white"
            variant="outlined"
            class="ma-1"
          >
            {{ benefit }}
          </v-chip>
        </div>
      </v-col>
      
      <v-col cols="12" md="6" class="pa-8">
        <v-card elevation="8" class="pa-6">
          <v-card-title class="text-h4 text-center mb-6">
            <v-icon color="primary" size="large" class="mr-2">mdi-account-plus</v-icon>
            Cadastro de Lead
          </v-card-title>

          <!-- Alert de erro -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>

          <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.nome"
                  label="Nome Completo *"
                  :rules="[rules.required, rules.name]"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.nome"
                  @blur="validateField('nome')"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="E-mail *"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  prepend-icon="mdi-email"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.email"
                  @blur="validateField('email')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.telefone"
                  label="Telefone *"
                  :rules="[rules.required, rules.phone]"
                  prepend-icon="mdi-phone"
                  variant="outlined"
                  placeholder="(11) 99999-9999"
                  v-mask="'(##) #####-####'"
                  required
                  :error-messages="fieldErrors.telefone"
                  @blur="validateField('telefone')"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.cargo"
                  label="Cargo *"
                  :rules="[rules.required]"
                  prepend-icon="mdi-briefcase"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.cargo"
                  @blur="validateField('cargo')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.dataNascimento"
                  label="Data de Nascimento *"
                  type="date"
                  :rules="[rules.required, rules.date]"
                  prepend-icon="mdi-calendar"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.dataNascimento"
                  @blur="validateField('dataNascimento')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.mensagem"
                  label="Mensagem *"
                  :rules="[rules.required, rules.message]"
                  prepend-icon="mdi-message-text"
                  variant="outlined"
                  rows="4"
                  required
                  :error-messages="fieldErrors.mensagem"
                  @blur="validateField('mensagem')"
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Campos de Tracking UTM (ocultos) -->
            <v-row class="d-none">
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.utm_source" label="UTM Source"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.utm_medium" label="UTM Medium"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.utm_campaign" label="UTM Campaign"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.utm_term" label="UTM Term"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.utm_content" label="UTM Content"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.gclid" label="GCLID"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.fbclid" label="FBCLID"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="isLoading"
                  :disabled="!valid || isLoading"
                  class="text-h6 py-3"
                >
                  <v-icon left>mdi-send</v-icon>
                  {{ isLoading ? 'Enviando...' : 'Enviar Cadastro' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-center">
          <v-icon color="success" size="large" class="mr-2">mdi-check-circle</v-icon>
          Cadastro Realizado!
        </v-card-title>
        <v-card-text class="text-center">
          <p class="text-h6 mb-4">Obrigado pelo seu interesse!</p>
          <p>Seus dados foram cadastrados com sucesso. Nossa equipe entrará em contato em breve.</p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="resetForm">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useLeadsStore } from '@/stores/leads'

export default {
  name: 'Formulario',
  setup() {
    const leadsStore = useLeadsStore()
    const form = ref(null)
    const valid = ref(false)
    const isLoading = ref(false)
    const successDialog = ref(false)
    const errorMessage = ref('')
    const fieldErrors = reactive({
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      dataNascimento: '',
      mensagem: ''
    })

    const formData = reactive({
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      dataNascimento: '',
      mensagem: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      gclid: '',
      fbclid: ''
    })

    const benefits = [
      'Consultoria Gratuita',
      'Materiais Exclusivos',
      'Suporte Especializado',
      'Atualizações em Primeira Mão'
    ]

    const rules = {
      required: (value) => !!value || 'Campo obrigatório',
      name: (value) => {
        if (!value) return true
        const trimmed = value.trim()
        return trimmed.length >= 2 || 'Nome deve ter pelo menos 2 caracteres'
      },
      email: (value) => {
        if (!value) return true
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || 'E-mail inválido'
      },
      phone: (value) => {
        if (!value) return true
        // Validação para telefone brasileiro
        const pattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        return pattern.test(value) || 'Telefone deve estar no formato (XX) XXXXX-XXXX'
      },
      date: (value) => {
        if (!value) return true
        const date = new Date(value)
        const today = new Date()
        const minDate = new Date('1900-01-01')
        
        if (date >= today) return 'Data deve ser anterior a hoje'
        if (date < minDate) return 'Data inválida'
        return true
      },
      message: (value) => {
        if (!value) return true
        const trimmed = value.trim()
        return trimmed.length >= 10 || 'Mensagem deve ter pelo menos 10 caracteres'
      }
    }

    const extractUTMParameters = () => {
      const urlParams = new URLSearchParams(window.location.search)
      formData.utm_source = urlParams.get('utm_source') || ''
      formData.utm_medium = urlParams.get('utm_medium') || ''
      formData.utm_campaign = urlParams.get('utm_campaign') || ''
      formData.utm_term = urlParams.get('utm_term') || ''
      formData.utm_content = urlParams.get('utm_content') || ''
      formData.gclid = urlParams.get('gclid') || ''
      formData.fbclid = urlParams.get('fbclid') || ''
    }

    const validateField = (fieldName) => {
      const value = formData[fieldName]
      const rule = rules[fieldName] || rules.required
      
      const error = rule(value)
      if (error === true) {
        fieldErrors[fieldName] = ''
      } else {
        fieldErrors[fieldName] = error
      }
    }

    const clearErrors = () => {
      errorMessage.value = ''
      Object.keys(fieldErrors).forEach(key => {
        fieldErrors[key] = ''
      })
    }

    const resetForm = () => {
      // Limpar dados do formulário
      Object.keys(formData).forEach(key => {
        if (!key.startsWith('utm_') && key !== 'gclid' && key !== 'fbclid') {
          formData[key] = ''
        }
      })
      
      // Limpar erros
      clearErrors()
      
      // Reset do formulário Vuetify
      form.value?.reset()
      
      // Fechar dialog
      successDialog.value = false
    }

    const submitForm = async () => {
      if (!valid.value) return

      clearErrors()
      isLoading.value = true

      try {
        // Preparar dados para envio
        const leadData = {
          nome: formData.nome.trim(),
          email: formData.email.trim().toLowerCase(),
          telefone: formData.telefone,
          cargo: formData.cargo.trim(),
          dataNascimento: formData.dataNascimento,
          mensagem: formData.mensagem.trim(),
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign,
          utm_term: formData.utm_term,
          utm_content: formData.utm_content,
          gclid: formData.gclid,
          fbclid: formData.fbclid
        }

        const result = await leadsStore.createLead(leadData)
        
        if (result.success) {
          successDialog.value = true
          // Manter parâmetros UTM para próximos envios
          extractUTMParameters()
        } else {
          errorMessage.value = result.message || 'Erro ao cadastrar lead'
        }
      } catch (error) {
        console.error('Erro ao cadastrar lead:', error)
        
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message
        } else if (error.response?.status === 409) {
          errorMessage.value = 'E-mail já cadastrado. Tente com outro e-mail.'
        } else {
          errorMessage.value = 'Erro ao enviar formulário. Tente novamente.'
        }
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      extractUTMParameters()
    })

    return {
      form,
      valid,
      isLoading,
      successDialog,
      errorMessage,
      fieldErrors,
      formData,
      benefits,
      rules,
      submitForm,
      validateField,
      resetForm
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
}

.v-text-field {
  margin-bottom: 8px;
}

.v-btn {
  border-radius: 8px;
}

/* Responsividade */
@media (max-width: 960px) {
  .hero-section {
    min-height: auto;
  }
}
</style>
