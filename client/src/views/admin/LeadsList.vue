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

        <!-- Tabela de Leads -->
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
          class="elevation-1"
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
import { ref, reactive, onMounted, computed } from 'vue'
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

    onMounted(() => {
      fetchLeads()
    })

    return {
      isLoading,
      isExporting,
      searchQuery,
      deleteDialog,
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
      formatDate
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
</style>
