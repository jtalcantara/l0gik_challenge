import axios from 'axios'
import { getApiUrl, isDev } from './env'

// Configurar base URL do axios
axios.defaults.baseURL = getApiUrl()

// Configurar timeout
axios.defaults.timeout = 10000 // 10 segundos

// Interceptor para requisições
axios.interceptors.request.use(
  (config) => {
    // Log em desenvolvimento
    if (isDev()) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    // Adicionar token se existir
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
    }
    
    // Tratar erro 401 (não autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin'
    }
    
    return Promise.reject(error)
  }
)

export default axios
