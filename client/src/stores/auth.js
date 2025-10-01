import { defineStore } from 'pinia'
import axios from '@/config/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await axios.post(`/auth/login`, credentials)
        
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          localStorage.setItem('token', this.token)
          
          // Configurar token no axios (token já vem com Bearer da API)
          axios.defaults.headers.common['Authorization'] = this.token
          
          return { success: true, message: response.data.message }
        } else {
          return { success: false, message: response.data.message }
        }
      } catch (error) {
        const errorData = error.response?.data
        const message = errorData?.errors?.[0]?.message || errorData?.message || 'Erro ao fazer login'
        return { success: false, message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async verifyToken() {
      if (!this.token) return false
      
      try {
        axios.defaults.headers.common['Authorization'] = this.token
        const response = await axios.get(`/auth/verify`)
        return response.data.success
      } catch (error) {
        console.warn('Token inválido, fazendo logout')
        this.logout()
        return false
      }
    },

    initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = this.token
        // Verificar token em background sem bloquear a UI
        this.verifyToken().catch(() => {
          console.warn('Falha na verificação do token')
        })
      }
    }
  }
})
