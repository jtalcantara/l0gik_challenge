import axios from 'axios'
import { getApiUrl, isDev } from './env'

// Configurar base URL do axios
axios.defaults.baseURL = getApiUrl()

// Configurar timeout
axios.defaults.timeout = 10000 // 10 segundos

// Configurar credenciais para CORS
axios.defaults.withCredentials = true

// Interceptor para requisições
axios.interceptors.request.use(
  (config) => {
    // Log em desenvolvimento
    if (isDev()) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    // Adicionar token se existir (token já vem com Bearer da API)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
      if (isDev()) {
        console.log('🔑 Token adicionado à requisição')
      }
    } else {
      if (isDev()) {
        console.warn('⚠️ Nenhum token encontrado no localStorage')
      }
    }
    
    return config
  },
  (error) => {
    console.error('❌ Erro na requisição:', error)
    return Promise.reject(error)
  }
)

// Interceptor para respostas
axios.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (isDev()) {
      console.log(`✅ ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    // Log de erro
    if (isDev()) {
      console.error(`❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`)
      if (error.response?.data) {
        console.error('📄 Dados do erro:', error.response.data)
      }
    }
    
    // Tratar erro 401 (não autorizado)
    if (error.response?.status === 401) {
      console.warn('🔒 Token inválido ou expirado, redirecionando para login')
      localStorage.removeItem('token')
      // Limpar headers do axios
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/'
    }
    
    return Promise.reject(error)
  }
)

export default axios
