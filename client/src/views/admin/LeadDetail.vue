<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card elevation="4" class="pa-6">
          <!-- Header -->
          <v-card-title class="text-h4 mb-6">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="$router.push('/admin/leads')"
              class="mr-2"
            ></v-btn>
            <v-icon color="primary" size="large" class="mr-2">mdi-account</v-icon>
            Detalhes do Lead
          </v-card-title>

          <v-row v-if="isLoading" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
              <p class="mt-4">Carregando dados do lead...</p>
            </v-col>
          </v-row>

          <v-row v-else-if="lead">
            <!-- Informações Pessoais -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4">
                <v-card-title class="text-h6 mb-4">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  Informações Pessoais
                </v-card-title>
                
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Nome</v-list-item-title>
                    <v-list-item-subtitle>{{ lead.nome }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ lead.email }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Telefone</v-list-item-title>
                    <v-list-item-subtitle>{{ lead.telefone }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Cargo</v-list-item-title>
                    <v-list-item-subtitle>{{ lead.cargo }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Data de Nascimento</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(lead.dataNascimento) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- Mensagem -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4">
                <v-card-title class="text-h6 mb-4">
                  <v-icon color="primary" class="mr-2">mdi-message-text</v-icon>
                  Mensagem
                </v-card-title>
                
                <v-card-text>
                  <p class="text-body-1">{{ lead.mensagem }}</p>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Tracking UTM -->
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4">
                <v-card-title class="text-h6 mb-4">
                  <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                  Dados de Tracking
                </v-card-title>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>UTM Source</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.utm_source || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>UTM Medium</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.utm_medium || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>UTM Campaign</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.utm_campaign || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>UTM Term</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.utm_term || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>UTM Content</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.utm_content || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>GCLID</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.gclid || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>FBCLID</v-list-item-title>
                        <v-list-item-subtitle>{{ lead.tracking.fbclid || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Data de Cadastro</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDateTime(lead.createdAt) }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Ações -->
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                color="warning"
                class="mr-2"
                @click="editLead"
              >
                <v-icon left>mdi-pencil</v-icon>
                Editar
              </v-btn>
              <v-btn
                color="error"
                @click="deleteLead"
              >
                <v-icon left>mdi-delete</v-icon>
                Excluir
              </v-btn>
            </v-col>
          </v-row>

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

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="confirmDelete">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'

export default {
  name: 'LeadDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const leadsStore = useLeadsStore()
    
    const isLoading = ref(false)
    const lead = ref(null)
    const deleteDialog = ref(false)

    const fetchLead = async () => {
      isLoading.value = true
      try {
        const result = await leadsStore.fetchLeadById(route.params.id)
        if (result.success) {
          lead.value = result.data
        }
      } catch (error) {
        console.error('Erro ao buscar lead:', error)
      } finally {
        isLoading.value = false
      }
    }

    const editLead = () => {
      router.push(`/admin/leads/${route.params.id}/edit`)
    }

    const deleteLead = () => {
      deleteDialog.value = true
    }

    const confirmDelete = async () => {
      try {
        await leadsStore.deleteLead(route.params.id)
        router.push('/admin/leads')
      } catch (error) {
        console.error('Erro ao deletar lead:', error)
      } finally {
        deleteDialog.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    }

    const formatDateTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchLead()
    })

    return {
      isLoading,
      lead,
      deleteDialog,
      editLead,
      deleteLead,
      confirmDelete,
      formatDate,
      formatDateTime
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
