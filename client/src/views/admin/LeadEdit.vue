<template>
  <div class="lead-edit-page">
    <!-- Background animado -->
    <div class="background-animation"></div>
    
    <v-container fluid class="pa-4 pa-md-6">
      <v-row>
        <v-col cols="12">
          <!-- Header -->
          <v-card elevation="8" class="header-card mb-6">
            <v-card-title class="pa-4 pa-md-6">
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-arrow-left"
                  variant="text"
                  @click="$router.push('/admin/leads')"
                  class="mr-4 back-btn"
                  size="large"
                ></v-btn>
                <div>
                  <h1 class="text-h4 font-weight-light text-grey-darken-3">Editar Lead</h1>
                  <p class="text-body-2 text-grey mb-0">Atualize as informações do lead</p>
                </div>
              </div>
            </v-card-title>
          </v-card>

          <v-row v-if="isLoading" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
              <p class="mt-4">Carregando dados do lead...</p>
            </v-col>
          </v-row>

          <v-card v-else-if="lead" elevation="4" class="form-card">
            <v-card-text class="pa-4 pa-md-6">
              <v-form ref="form" v-model="valid" @submit.prevent="updateLead">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.nome"
                      label="Nome Completo *"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-account-outline"
                      variant="outlined"
                      required
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.email"
                      label="E-mail *"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      required
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.telefone"
                      label="Telefone *"
                      :rules="[rules.required, rules.phone]"
                      prepend-inner-icon="mdi-phone-outline"
                      variant="outlined"
                      placeholder="(11) 99999-9999"
                      v-mask="'(##) #####-####'"
                      required
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.cargo"
                      label="Cargo *"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-briefcase-outline"
                      variant="outlined"
                      required
                      class="mb-4"
                      color="primary"
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
                      prepend-inner-icon="mdi-calendar-outline"
                      variant="outlined"
                      required
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.mensagem"
                      label="Mensagem *"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-message-text-outline"
                      variant="outlined"
                      rows="4"
                      required
                      class="mb-4"
                      color="primary"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <!-- Campos de Tracking UTM -->
                <v-divider class="my-6"></v-divider>
                <h3 class="text-h6 mb-4">Dados de Tracking</h3>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.utm_source"
                      label="UTM Source"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.utm_medium"
                      label="UTM Medium"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.utm_campaign"
                      label="UTM Campaign"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.utm_term"
                      label="UTM Term"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.utm_content"
                      label="UTM Content"
                      prepend-inner-icon="mdi-chart-line"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.gclid"
                      label="GCLID"
                      prepend-inner-icon="mdi-google"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.fbclid"
                      label="FBCLID"
                      prepend-inner-icon="mdi-facebook"
                      variant="outlined"
                      class="mb-4"
                      color="primary"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                      color="grey"
                      variant="outlined"
                      class="mr-4 cancel-btn"
                      @click="$router.push('/admin/leads')"
                      size="large"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      type="submit"
                      color="primary"
                      variant="elevated"
                      :loading="isSubmitting"
                      :disabled="!valid"
                      class="save-btn"
                      size="large"
                    >
                      <v-icon left>mdi-content-save</v-icon>
                      Salvar Alterações
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Lead não encontrado -->
          <v-row v-else class="justify-center">
            <v-col cols="12" class="text-center">
              <v-icon size="64" color="grey">mdi-account-question</v-icon>
              <p class="text-h6 mt-4">Lead não encontrado</p>
              <v-btn
                color="primary"
                @click="$router.push('/admin/leads')"
              >
                Voltar para Lista
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'

export default {
  name: 'LeadEdit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const leadsStore = useLeadsStore()
    
    const form = ref(null)
    const valid = ref(false)
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const lead = ref(null)

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

    const rules = {
      required: (value) => !!value || 'Campo obrigatório',
      email: (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || 'E-mail inválido'
      },
      phone: (value) => {
        const pattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        return pattern.test(value) || 'Telefone deve estar no formato (XX) XXXXX-XXXX'
      },
      date: (value) => {
        if (!value) return true
        const date = new Date(value)
        const today = new Date()
        return date < today || 'Data deve ser anterior a hoje'
      }
    }

    const fetchLead = async () => {
      isLoading.value = true
      try {
        const result = await leadsStore.fetchLeadById(route.params.id)
        if (result.success) {
          lead.value = result.data
          // Preencher formulário com dados do lead
          Object.assign(formData, {
            nome: lead.value.nome,
            email: lead.value.email,
            telefone: lead.value.telefone,
            cargo: lead.value.cargo,
            dataNascimento: lead.value.dataNascimento,
            mensagem: lead.value.mensagem,
            utm_source: lead.value.tracking?.utm_source || '',
            utm_medium: lead.value.tracking?.utm_medium || '',
            utm_campaign: lead.value.tracking?.utm_campaign || '',
            utm_term: lead.value.tracking?.utm_term || '',
            utm_content: lead.value.tracking?.utm_content || '',
            gclid: lead.value.tracking?.gclid || '',
            fbclid: lead.value.tracking?.fbclid || ''
          })
        }
      } catch (error) {
        console.error('Erro ao buscar lead:', error)
      } finally {
        isLoading.value = false
      }
    }

    const updateLead = async () => {
      if (!valid.value) return

      isSubmitting.value = true
      try {
        const result = await leadsStore.updateLead(route.params.id, formData)
        if (result.success) {
          router.push(`/admin/leads/${route.params.id}`)
        }
      } catch (error) {
        console.error('Erro ao atualizar lead:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      fetchLead()
    })

    return {
      form,
      valid,
      isLoading,
      isSubmitting,
      lead,
      formData,
      rules,
      updateLead
    }
  }
}
</script>

<style scoped>
/* Layout principal */
.lead-edit-page {
  position: relative;
  min-height: 100vh;
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

/* Cards modernos */
.header-card, .form-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.header-card:hover, .form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Container do ícone */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Botão de voltar */
.back-btn {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Campos de formulário */
.v-text-field :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.v-text-field :deep(.v-field):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-text-field :deep(.v-field):focus-within {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.v-text-field :deep(.v-field__prepend-inner) {
  padding-right: 8px;
  padding-left: 12px;
}

.v-text-field :deep(.v-field__prepend-inner .v-icon) {
  font-size: 18px;
  color: rgba(102, 126, 234, 0.7);
}

.v-textarea :deep(.v-field__prepend-inner) {
  padding-right: 8px;
  padding-left: 12px;
}

.v-textarea :deep(.v-field__prepend-inner .v-icon) {
  font-size: 18px;
  color: rgba(102, 126, 234, 0.7);
}

/* Espaçamento entre campos */
.v-text-field {
  margin-bottom: 12px;
}

.v-textarea {
  margin-bottom: 12px;
}

/* Reduzir espaçamento das linhas */
.v-row {
  margin-bottom: 8px;
}

/* Espaçamento do divisor */
.v-divider {
  margin: 20px 0;
}

/* Espaçamento dos títulos */
h3 {
  margin-bottom: 16px;
}

/* Botões de ação */
.cancel-btn {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.save-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Responsividade */
@media (max-width: 768px) {
  .lead-edit-page {
    padding: 0 16px;
  }
  
  .header-card, .form-card {
    margin: 0 8px;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
  }
  
  .d-flex.justify-end {
    flex-direction: column;
    gap: 12px;
  }
  
  .cancel-btn, .save-btn {
    width: 100%;
  }
  
  /* Reduzir espaçamento vertical em mobile */
  .v-text-field, .v-textarea {
    margin-bottom: 12px;
  }
  
  .v-row {
    margin-bottom: 8px;
  }
  
  .v-divider {
    margin: 16px 0;
  }
  
  h3 {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .lead-edit-page {
    padding: 0 12px;
  }
  
  .header-card, .form-card {
    margin: 0 4px;
    padding: 16px;
  }
  
  .v-text-field, .v-textarea {
    margin-bottom: 8px;
  }
  
  .v-row {
    margin-bottom: 4px;
  }
  
  .v-divider {
    margin: 12px 0;
  }
  
  h3 {
    margin-bottom: 12px;
  }
}

/* Animações suaves */
* {
  transition: all 0.3s ease;
}
</style>
