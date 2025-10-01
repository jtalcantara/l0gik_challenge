<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-row no-gutters class="hero-section">
      <!-- Título e descrição no topo -->
      <v-col cols="12" class="pa-6 pa-md-12 d-flex justify-center align-center">
        <div class="text-center">
          <h1 class="text-h4 text-md-h3 font-weight-bold mb-4 text-white">
            Cadastre-se e Transforme seu Negócio
          </h1>
          <p class="text-body-1 text-md-h6 text-white mb-6">
            Preencha o formulário abaixo e receba informações exclusivas sobre nossos produtos e serviços.
          </p>
          <div class="d-flex flex-wrap justify-center">
            <v-chip
              v-for="benefit in benefits"
              :key="benefit"
              color="white"
              variant="outlined"
              class="ma-1"
              size="small"
            >
              {{ benefit }}
            </v-chip>
          </div>
        </div>
      </v-col>
      
      <!-- Formulário centralizado -->
      <v-col cols="12" class="d-flex justify-center pa-2 pa-md-4">
        <div class="form-container">
        <v-card elevation="8" class="pa-4 pa-md-6" rounded="lg">
          <v-card-title class="text-h5 text-md-h4 text-center mb-4 mb-md-6">
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

          <!-- Debug: Mostrar parâmetros UTM capturados -->
          <v-alert
            v-if="hasUTMParameters"
            type="info"
            variant="tonal"
            class="mb-4"
            closable
          >
            <template #title>
              <v-icon class="mr-2">mdi-tag-multiple</v-icon>
              Parâmetros de Tracking Capturados
            </template>
            <div class="mt-2">
              <v-chip v-if="formData.utm_source" color="primary" size="small" class="ma-1">
                Source: {{ formData.utm_source }}
              </v-chip>
              <v-chip v-if="formData.utm_medium" color="secondary" size="small" class="ma-1">
                Medium: {{ formData.utm_medium }}
              </v-chip>
              <v-chip v-if="formData.utm_campaign" color="success" size="small" class="ma-1">
                Campaign: {{ formData.utm_campaign }}
              </v-chip>
              <v-chip v-if="formData.gclid" color="warning" size="small" class="ma-1">
                GCLID: {{ formData.gclid }}
              </v-chip>
              <v-chip v-if="formData.fbclid" color="info" size="small" class="ma-1">
                FBCLID: {{ formData.fbclid }}
              </v-chip>
            </div>
          </v-alert>

          <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.nome"
                  label="Nome Completo *"
                  :rules="[rules.required, rules.name]"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.nome"
                  @blur="validateField('nome')"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
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
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.telefone"
                  label="Telefone *"
                  :rules="[rules.required, rules.phone]"
                  prepend-icon="mdi-phone"
                  variant="outlined"
                  placeholder="(11) 99999-9999 ou (11) 3333-4444"
                  required
                  :error-messages="fieldErrors.telefone"
                  @blur="validateField('telefone')"
                  @input="formatPhone"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.cargo"
                  label="Cargo *"
                  :rules="[rules.required]"
                  prepend-icon="mdi-briefcase"
                  variant="outlined"
                  required
                  :error-messages="fieldErrors.cargo"
                  @blur="validateField('cargo')"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
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
                  density="comfortable"
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
                  density="comfortable"
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
                  class="text-body-1 text-md-h6 py-3"
                >
                  <v-icon left>mdi-send</v-icon>
                  {{ isLoading ? 'Enviando...' : 'Enviar Cadastro' }}
                </v-btn>
              </v-col>
            </v-row>

          </v-form>
        </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Seção de Testes UTM -->
    <v-row no-gutters class="hero-section">
      <v-col cols="12" class="d-flex justify-center pa-2 pa-md-4">
        <div class="form-container">
          <v-card elevation="8" class="pa-4 pa-md-6" rounded="lg">
            <v-card-title class="text-h5 text-md-h4 text-center mb-4 mb-md-6">
              <v-icon color="info" size="large" class="mr-2">mdi-test-tube</v-icon>
              Links de Teste UTM
            </v-card-title>
            
            <v-card-text class="pa-0">
              <v-alert
                type="info"
                variant="tonal"
                class="mb-6"
                closable
              >
                <template #title>
                  Como testar os parâmetros UTM?
                </template>
                <p class="mt-2 mb-0">
                  Clique nos botões abaixo para testar diferentes cenários de tracking UTM. 
                  Cada link simula uma fonte de tráfego diferente com parâmetros específicos.
                </p>
              </v-alert>

              <v-row class="utm-test-cards">
                <v-col v-for="(url, name) in testLinks" :key="name" cols="12" sm="6" md="4" lg="3">
                  <v-card
                    :href="url"
                    target="_blank"
                    elevation="2"
                    hover
                    class="text-decoration-none h-100"
                  >
                    <v-card-text class="pa-4 text-center d-flex flex-column h-100">
                      <v-icon 
                        :color="getTestIconColor(name)" 
                        size="32" 
                        class="mb-3"
                      >
                        {{ getTestIcon(name) }}
                      </v-icon>
                      <h6 class="text-subtitle-1 font-weight-bold mb-2">
                        {{ getTestTitle(name) }}
                      </h6>
                      <p class="text-caption text-medium-emphasis mb-3 flex-grow-1">
                        {{ getTestDescription(name) }}
                      </p>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        size="small"
                        block
                        class="mt-auto"
                      >
                        <v-icon left size="small">mdi-open-in-new</v-icon>
                        Testar
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-divider class="my-6"></v-divider>
              
            </v-card-text>
          </v-card>
        </div>
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
        // Validação para telefone brasileiro (fixo ou celular)
        const phonePattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        return phonePattern.test(value) || 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
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

    const formatPhone = (event) => {
      let value = event.target.value
      
      // Remove todos os caracteres não numéricos
      const numbers = value.replace(/\D/g, '')
      
      // Limita a 11 dígitos (DDD + 9 dígitos)
      const limitedNumbers = numbers.slice(0, 11)
      
      // Aplica a máscara baseada no número de dígitos
      if (limitedNumbers.length <= 2) {
        formData.telefone = limitedNumbers
      } else if (limitedNumbers.length <= 6) {
        formData.telefone = `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
      } else if (limitedNumbers.length <= 10) {
        // Telefone fixo: (XX) XXXX-XXXX
        formData.telefone = `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`
      } else {
        // Celular: (XX) 9XXXX-XXXX
        formData.telefone = `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`
      }
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

    // Computed para verificar se há parâmetros UTM
    const hasUTMParameters = computed(() => {
      return formData.utm_source || 
             formData.utm_medium || 
             formData.utm_campaign || 
             formData.utm_term || 
             formData.utm_content || 
             formData.gclid || 
             formData.fbclid
    })

    // Links de teste com diferentes UTM
    const testLinks = {
      googleAds: 'http://localhost:5173/formulario?utm_source=google&utm_medium=cpc&utm_campaign=google_ads&utm_term=desenvolvimento&utm_content=banner&gclid=abc123456',
      facebookAds: 'http://localhost:5173/formulario?utm_source=facebook&utm_medium=social&utm_campaign=fb_ads&utm_content=video&fbclid=xyz789012',
      emailMarketing: 'http://localhost:5173/formulario?utm_source=newsletter&utm_medium=email&utm_campaign=promocao&utm_content=cta_button',
      instagram: 'http://localhost:5173/formulario?utm_source=instagram&utm_medium=social&utm_campaign=stories&utm_content=carousel',
      youtube: 'http://localhost:5173/formulario?utm_source=youtube&utm_medium=video&utm_campaign=tutorial&utm_term=vue&utm_content=thumbnail',
      linkedin: 'http://localhost:5173/formulario?utm_source=linkedin&utm_medium=social&utm_campaign=professional&utm_content=post',
      twitter: 'http://localhost:5173/formulario?utm_source=twitter&utm_medium=social&utm_campaign=thread&utm_content=retweet',
      organic: 'http://localhost:5173/formulario?utm_source=google&utm_medium=organic&utm_campaign=seo&utm_term=vue+js',
      direct: 'http://localhost:5173/formulario?utm_source=direct&utm_medium=none&utm_campaign=bookmark',
      referral: 'http://localhost:5173/formulario?utm_source=github&utm_medium=referral&utm_campaign=opensource'
    }

    // Funções auxiliares para os cards de teste
    const getTestIcon = (name) => {
      const icons = {
        googleAds: 'mdi-google',
        facebookAds: 'mdi-facebook',
        emailMarketing: 'mdi-email',
        instagram: 'mdi-instagram',
        youtube: 'mdi-youtube',
        linkedin: 'mdi-linkedin',
        twitter: 'mdi-twitter',
        organic: 'mdi-magnify',
        direct: 'mdi-bookmark',
        referral: 'mdi-github'
      }
      return icons[name] || 'mdi-link'
    }

    const getTestIconColor = (name) => {
      const colors = {
        googleAds: 'red',
        facebookAds: 'blue',
        emailMarketing: 'orange',
        instagram: 'pink',
        youtube: 'red',
        linkedin: 'blue',
        twitter: 'light-blue',
        organic: 'green',
        direct: 'grey',
        referral: 'purple'
      }
      return colors[name] || 'primary'
    }

    const getTestTitle = (name) => {
      const titles = {
        googleAds: 'Google Ads',
        facebookAds: 'Facebook Ads',
        emailMarketing: 'Email Marketing',
        instagram: 'Instagram',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
        organic: 'SEO/Organic',
        direct: 'Acesso Direto',
        referral: 'Referral'
      }
      return titles[name] || name
    }

    const getTestDescription = (name) => {
      const descriptions = {
        googleAds: 'Campanhas pagas no Google com GCLID',
        facebookAds: 'Anúncios no Facebook com FBCLID',
        emailMarketing: 'Newsletters e campanhas por email',
        instagram: 'Stories e posts no Instagram',
        youtube: 'Vídeos e anúncios no YouTube',
        linkedin: 'Posts profissionais no LinkedIn',
        twitter: 'Threads e posts no Twitter',
        organic: 'Tráfego orgânico do Google',
        direct: 'Acesso direto sem referrer',
        referral: 'Tráfego de referência'
      }
      return descriptions[name] || 'Teste de tracking'
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
      resetForm,
      formatPhone,
      hasUTMParameters,
      testLinks,
      getTestIcon,
      getTestIconColor,
      getTestTitle,
      getTestDescription
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  min-height: 100vh;
  padding: 60px 0;
}

.full-height {
  height: 100vh;
  min-height: 100vh;
}

/* Garantir que o formulário ocupe toda a tela quando isolado */
.v-application {
  height: 100vh;
}

/* Remover margens e padding padrão quando isolado */
.v-main {
  padding: 0 !important;
}

/* Container do formulário centralizado */
.form-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .form-container {
    max-width: 100%;
    padding: 0 8px;
  }
  
  .hero-section {
    min-height: 100vh;
    padding: 20px 0;
  }
  
  .v-card {
    margin: 0 4px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 0 4px;
  }
  
  .v-card {
    margin: 0 2px;
  }
}

@media (min-width: 1200px) {
  .form-container {
    max-width: 900px;
  }
}

/* Garantir que o container não quebre */
.v-container--fluid {
  max-width: 100%;
  overflow-x: hidden;
}

/* Melhorar espaçamento em telas pequenas */
@media (max-width: 600px) {
  .v-row {
    margin: 0;
  }
  
  .v-col {
    padding: 8px;
  }
}

/* Estilos específicos para a seção UTM */
.utm-test-cards {
  min-height: 200px;
}

.utm-test-cards .v-card {
  transition: transform 0.2s ease-in-out;
}

.utm-test-cards .v-card:hover {
  transform: translateY(-2px);
}

/* Responsividade das seções */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 0;
    min-height: auto;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 0;
  }
}

/* Remover espaçamento entre seções para background contínuo */
.hero-section + .hero-section {
  margin-top: 0;
}

/* Responsividade dos cards UTM */
@media (max-width: 768px) {
  .utm-test-cards .v-card-text {
    padding: 16px !important;
  }
  
  .utm-test-cards .v-icon {
    font-size: 24px !important;
  }
}

@media (max-width: 480px) {
  .utm-test-cards .v-card-text {
    padding: 12px !important;
  }
  
  .utm-test-cards .v-btn {
    font-size: 0.75rem !important;
  }
}
</style>
