<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- Título da Página -->
        <div class="d-flex align-center mb-6">
          <v-icon color="primary" size="large" class="mr-3">mdi-account-group</v-icon>
          <h1 class="text-h4">Gestão de Leads</h1>
        </div>

        <!-- Barra de Ações -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Buscar por nome ou email"
              prepend-icon="mdi-magnify"
              variant="outlined"
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center">
            <v-btn
              color="primary"
              variant="outlined"
              @click="exportLeads('csv')"
              :loading="isExporting"
            >
              <v-icon left>mdi-file-download</v-icon>
              Exportar CSV
            </v-btn>
          </v-col>
        </v-row>

        <!-- Dica de scroll horizontal para mobile -->
        <v-alert
          v-if="isMobile && showScrollHint"
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
          closable
          @click:close="hideScrollHint"
        >
          <v-icon start>mdi-gesture-swipe-horizontal</v-icon>
          Deslize horizontalmente para ver mais dados
        </v-alert>

        <!-- Tabela de Leads -->
        <div class="table-container" ref="tableContainer">
          <v-data-table
            :headers="headers"
            :items="leads"
            :loading="isLoading"
            :items-per-page="pagination.itemsPerPage"
            :page="pagination.currentPage"
            :server-items-length="pagination.totalItems"
            :items-per-page-options="[5, 10, 20, 100]"
            @update:page="handlePageChange"
            @update:items-per-page="handleItemsPerPageChange"
            class="elevation-1 responsive-table"
            :mobile-breakpoint="0"
          >
            <template v-slot:item.nome="{ item }">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="32" class="mr-3">
                  <span class="text-white">{{ item.nome.charAt(0).toUpperCase() }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.nome }}</div>
                  <div class="text-caption text-grey">{{ item.cargo }}</div>
                </div>
              </div>
            </template>

            <template v-slot:item.email="{ item }">
              <div>
                <v-icon size="small" class="mr-1">mdi-email</v-icon>
                {{ item.email }}
              </div>
            </template>

            <template v-slot:item.telefone="{ item }">
              <div>
                <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                {{ item.telefone }}
              </div>
            </template>

            <template v-slot:item.cargo="{ item }">
              <div>
                <v-chip size="small" color="primary" variant="outlined">
                  {{ item.cargo }}
                </v-chip>
              </div>
            </template>

            <template v-slot:item.dataNascimento="{ item }">
              <div>
                {{ formatDate(item.dataNascimento) }}
              </div>
            </template>

            <template v-slot:item.tracking.utm_source="{ item }">
              <div>
                <v-chip 
                  v-if="item.tracking.utm_source" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                >
                  {{ item.tracking.utm_source }}
                </v-chip>
                <span v-else class="text-grey">-</span>
              </div>
            </template>

            <template v-slot:item.tracking.utm_campaign="{ item }">
              <div>
                <v-chip 
                  v-if="item.tracking.utm_campaign" 
                  size="small" 
                  color="info" 
                  variant="outlined"
                >
                  {{ item.tracking.utm_campaign }}
                </v-chip>
                <span v-else class="text-grey">-</span>
              </div>
            </template>

            <template v-slot:item.createdAt="{ item }">
              <div>
                {{ formatDate(item.createdAt) }}
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-eye"
                size="small"
                color="grey-darken-1"
                variant="text"
                @click="viewLead(item.id)"
                class="mr-1"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="grey-darken-1"
                variant="text"
                @click="editLead(item.id)"
                class="mr-1"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="grey-darken-1"
                variant="text"
                @click="deleteLead(item.id)"
              ></v-btn>
            </template>
          </v-data-table>
        </div>
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
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'

export default {
  name: 'LeadsList',
  setup() {
    const router = useRouter()
    const leadsStore = useLeadsStore()
    
    const isLoading = ref(false)
    const isExporting = ref(false)
    const searchQuery = ref('')
    const deleteDialog = ref(false)
    const leadToDelete = ref(null)
    const isMobile = ref(false)
    const showScrollHint = ref(true)
    const tableContainer = ref(null)

    const headers = [
      { title: 'Nome', key: 'nome', sortable: false },
      { title: 'Email', key: 'email', sortable: false },
      { title: 'Telefone', key: 'telefone', sortable: false },
      { title: 'Cargo', key: 'cargo', sortable: false },
      { title: 'Data de Nascimento', key: 'dataNascimento', sortable: false },
      { title: 'UTM Source', key: 'tracking.utm_source', sortable: false },
      { title: 'UTM Campaign', key: 'tracking.utm_campaign', sortable: false },
      { title: 'Data de Cadastro', key: 'createdAt', sortable: false },
      { title: 'Ações', key: 'actions', sortable: false, width: '200px' }
    ]

    const leads = computed(() => leadsStore.leads)
    const pagination = computed(() => leadsStore.pagination)

    const fetchLeads = async (page = 1, limit = 5, search = '') => {
      isLoading.value = true
      try {
        await leadsStore.fetchLeads(page, limit, search)
      } catch (error) {
        console.error('Erro ao buscar leads:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleSearch = () => {
      fetchLeads(1, pagination.value.itemsPerPage, searchQuery.value)
    }

    const handlePageChange = (page) => {
      fetchLeads(page, pagination.value.itemsPerPage, searchQuery.value)
    }

    const handleItemsPerPageChange = (itemsPerPage) => {
      fetchLeads(1, itemsPerPage, searchQuery.value)
    }

    const viewLead = (id) => {
      router.push(`/admin/leads/${id}`)
    }

    const editLead = (id) => {
      router.push(`/admin/leads/${id}/edit`)
    }

    const deleteLead = (id) => {
      leadToDelete.value = id
      deleteDialog.value = true
    }

    const confirmDelete = async () => {
      if (!leadToDelete.value) return

      try {
        await leadsStore.deleteLead(leadToDelete.value)
        await fetchLeads(pagination.value.currentPage, pagination.value.itemsPerPage, searchQuery.value)
      } catch (error) {
        console.error('Erro ao deletar lead:', error)
      } finally {
        deleteDialog.value = false
        leadToDelete.value = null
      }
    }

    const exportLeads = async (format) => {
      isExporting.value = true
      try {
        await leadsStore.exportLeads(format)
      } catch (error) {
        console.error('Erro ao exportar leads:', error)
        // Aqui você pode adicionar uma notificação de erro se desejar
      } finally {
        isExporting.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 960
    }

    const hideScrollHint = () => {
      showScrollHint.value = false
      localStorage.setItem('hideScrollHint', 'true')
    }

    const setupScrollHint = () => {
      const hideHint = localStorage.getItem('hideScrollHint')
      if (hideHint === 'true') {
        showScrollHint.value = false
      }
    }

    onMounted(() => {
      fetchLeads()
      checkMobile()
      setupScrollHint()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      isLoading,
      isExporting,
      searchQuery,
      deleteDialog,
      isMobile,
      showScrollHint,
      tableContainer,
      headers,
      leads,
      pagination,
      fetchLeads,
      handleSearch,
      handlePageChange,
      handleItemsPerPageChange,
      viewLead,
      editLead,
      deleteLead,
      confirmDelete,
      exportLeads,
      formatDate,
      hideScrollHint
    }
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-btn {
  border-radius: 4px;
}

/* Container da tabela com scroll horizontal */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Estilos para a tabela responsiva */
.responsive-table {
  min-width: 1000px; /* Largura mínima para evitar compressão excessiva */
}

/* Melhorar a aparência das células em mobile */
.responsive-table :deep(.v-data-table__td) {
  white-space: nowrap;
  padding: 12px 16px;
  font-size: 0.875rem;
}

.responsive-table :deep(.v-data-table__th) {
  white-space: nowrap;
  padding: 16px;
  font-weight: 600;
  background-color: #f5f5f5;
}

/* Ajustar botões de ação para mobile */
.responsive-table :deep(.v-data-table__td:last-child) {
  min-width: 120px;
}

.responsive-table :deep(.v-btn) {
  min-width: 32px;
  height: 32px;
}

/* Melhorar visualização dos chips */
.responsive-table :deep(.v-chip) {
  font-size: 0.75rem;
  height: 24px;
}

/* Ajustar avatar para mobile */
.responsive-table :deep(.v-avatar) {
  flex-shrink: 0;
}

/* Indicador visual de scroll horizontal */
.table-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.table-container:hover::after {
  opacity: 1;
}

/* Melhorar responsividade em telas muito pequenas */
@media (max-width: 600px) {
  .responsive-table {
    min-width: 800px;
  }
  
  .responsive-table :deep(.v-data-table__td),
  .responsive-table :deep(.v-data-table__th) {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .responsive-table :deep(.v-btn) {
    min-width: 28px;
    height: 28px;
  }
  
  .responsive-table :deep(.v-chip) {
    font-size: 0.7rem;
    height: 20px;
  }
}

/* Ajustar barra de ações para mobile */
@media (max-width: 960px) {
  .d-flex.justify-end {
    justify-content: flex-start !important;
    margin-top: 16px;
  }
}
</style>
