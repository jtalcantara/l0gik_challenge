<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card elevation="4" class="pa-6">
          <v-card-title class="text-h4 mb-6">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="$router.push('/admin/leads')"
              class="mr-2"
            ></v-btn>
            <v-icon color="primary" size="large" class="mr-2">mdi-pencil</v-icon>
            Editar Lead
          </v-card-title>

          <v-row v-if="isLoading" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
              <p class="mt-4">Carregando dados do lead...</p>
            </v-col>
          </v-row>

          <v-form v-else-if="lead" ref="form" v-model="valid" @submit.prevent="updateLead">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.nome"
                  label="Nome Completo *"
                  :rules="[rules.required]"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  required
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
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.mensagem"
                  label="Mensagem *"
                  :rules="[rules.required]"
                  prepend-icon="mdi-message-text"
                  variant="outlined"
                  rows="4"
                  required
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
                  prepend-icon="mdi-chart-line"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.utm_medium"
                  label="UTM Medium"
                  prepend-icon="mdi-chart-line"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.utm_campaign"
                  label="UTM Campaign"
                  prepend-icon="mdi-chart-line"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.utm_term"
                  label="UTM Term"
                  prepend-icon="mdi-chart-line"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.utm_content"
                  label="UTM Content"
                  prepend-icon="mdi-chart-line"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.gclid"
                  label="GCLID"
                  prepend-icon="mdi-google"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.fbclid"
                  label="FBCLID"
                  prepend-icon="mdi-facebook"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="grey"
                  class="mr-2"
                  @click="$router.push('/admin/leads')"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="!valid"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Salvar Alterações
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
.v-card {
  border-radius: 8px;
}

.v-btn {
  border-radius: 4px;
}
</style>
