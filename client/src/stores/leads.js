import { defineStore } from 'pinia'
import axios from 'axios'

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

        const response = await axios.get(`/api/leads?${params}`)
        
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
        const response = await axios.post('/api/leads', leadData)
        
        if (response.data.success) {
          this.leads.unshift(response.data.data)
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao criar lead:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchLeadById(id) {
      this.isLoading = true
      try {
        const response = await axios.get(`/api/leads/${id}`)
        
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
        const response = await axios.put(`/api/leads/${id}`, leadData)
        
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
        const response = await axios.delete(`/api/leads/${id}`)
        
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
        const response = await axios.get(`/api/leads/export/${format}`, {
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `leads.${format}`)
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
