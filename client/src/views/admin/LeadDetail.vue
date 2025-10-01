<template>
  <div class="lead-detail-page">
    <!-- Background animado -->
    <div class="background-animation"></div>
    
    <v-container fluid class="pa-6 pa-md-8">
      <v-row>
        <v-col cols="12">
          <!-- Header -->
          <v-card elevation="8" class="header-card mb-6">
            <v-card-title class="pa-6">
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-arrow-left"
                  variant="text"
                  @click="$router.push('/admin/leads')"
                  class="mr-4 back-btn"
                  size="large"
                ></v-btn>
                <div>
                  <h1 class="text-h4 font-weight-light text-grey-darken-3">Detalhes do Lead</h1>
                  <p class="text-body-2 text-grey mb-0">Visualize todas as informações do lead</p>
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

          <v-row v-else-if="lead">
            <!-- Informações Pessoais -->
            <v-col cols="12" md="6">
              <v-card elevation="4" class="info-card pa-6">
                <v-card-title class="text-h6 mb-4">
                  <div class="d-flex align-center">
                    <span>Informações Pessoais</span>
                  </div>
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
              <v-card elevation="4" class="info-card pa-6">
                <v-card-title class="text-h6 mb-4">
                  Mensagem
                </v-card-title>
                
                <v-list>
                      <v-list-item>
                        <v-list-item-subtitle>{{ lead.mensagem || 'Não informado' }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
              </v-card>
            </v-col>

            <!-- Tracking UTM -->
            <v-col cols="12">
              <v-card elevation="4" class="info-card pa-6">
                <v-card-title class="text-h6 mb-4">
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
                variant="elevated"
                size="large"
                class="mr-4 edit-btn"
                @click="editLead"
              >
                <v-icon left>mdi-pencil</v-icon>
                Editar
              </v-btn>
              <v-btn
                color="error"
                variant="elevated"
                size="large"
                class="delete-btn"
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
  </div>
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
/* Layout principal */
.lead-detail-page {
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
.header-card, .info-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.header-card:hover, .info-card:hover {
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

/* Ícone da seção */
.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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

/* Lista de informações */
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

/* Botões de ação */
.edit-btn {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6);
}

.delete-btn {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
}

/* Responsividade */
@media (max-width: 768px) {
  .lead-detail-page {
    padding: 0 16px;
  }
  
  .header-card, .info-card {
    margin: 0 8px;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
  }
  
  .section-icon {
    width: 35px;
    height: 35px;
  }
  
  /* Botões responsivos */
  .d-flex.justify-end {
    flex-direction: column;
    gap: 12px;
  }
  
  .edit-btn, .delete-btn {
    width: 100%;
  }
}

/* Animações suaves */
* {
  transition: all 0.3s ease;
}
</style>
