import { defineStore } from 'pinia'
import axios from '@/config/axios'

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    leads: [],
    currentLead: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    },
    isLoading: false,
    searchQuery: ''
  }),

  getters: {
    filteredLeads: (state) => {
      if (!state.searchQuery) return state.leads
      
      const query = state.searchQuery.toLowerCase()
      return state.leads.filter(lead => 
        lead.nome.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      )
    }
  },

  actions: {
    async fetchLeads(page = 1, limit = 10, search = '') {
      this.isLoading = true
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        })
        
        if (search) {
          params.append('search', search)
        }

        const response = await axios.get(`/leads?${params}`)
        
        if (response.data.success) {
          this.leads = response.data.data.leads
          this.pagination = response.data.data.pagination
          this.searchQuery = search
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao buscar leads:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createLead(leadData) {
      this.isLoading = true
      try {
        const response = await axios.post(`/leads`, leadData)
        
        if (response.data.success) {
          this.leads.unshift(response.data.data)
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao criar lead:', error)
        
        // Re-throw o erro para que o componente possa tratá-lo
        if (error.response) {
          // Erro de resposta do servidor
          const errorData = {
            message: error.response.data?.message || 'Erro no servidor',
            status: error.response.status,
            data: error.response.data
          }
          throw errorData
        } else if (error.request) {
          // Erro de rede
          throw {
            message: 'Erro de conexão. Verifique sua internet e tente novamente.',
            status: 0
          }
        } else {
          // Outro tipo de erro
          throw {
            message: 'Erro inesperado. Tente novamente.',
            status: 0
          }
        }
      } finally {
        this.isLoading = false
      }
    },

    async fetchLeadById(id) {
      this.isLoading = true
      try {
        const response = await axios.get(`/leads/${id}`)
        
        if (response.data.success) {
          this.currentLead = response.data.data
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao buscar lead:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateLead(id, leadData) {
      this.isLoading = true
      try {
        const response = await axios.patch(`/leads/${id}`, leadData)
        
        if (response.data.success) {
          const index = this.leads.findIndex(lead => lead.id === id)
          if (index !== -1) {
            this.leads[index] = response.data.data
          }
          this.currentLead = response.data.data
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar lead:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteLead(id) {
      this.isLoading = true
      try {
        const response = await axios.delete(`/leads/${id}`)
        
        if (response.data.success) {
          this.leads = this.leads.filter(lead => lead.id !== id)
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao deletar lead:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async exportLeads(format = 'csv') {
      try {
        const response = await axios.get(`/leads/export/csv`, {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `leads.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        return { success: true }
      } catch (error) {
        console.error('Erro ao exportar leads:', error)
        throw error
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    clearCurrentLead() {
      this.currentLead = null
    }
  }
})
