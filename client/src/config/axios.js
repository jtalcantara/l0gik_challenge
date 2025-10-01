import axios from 'axios'
import { getApiUrl, isDev } from './env'
import { useToast } from '../composables/useToast'

// Configurar base URL do axios
axios.defaults.baseURL = getApiUrl()

// Configurar timeout
axios.defaults.timeout = 10000 // 10 segundos

// Configurar para sempre tentar parsear JSON
axios.defaults.responseType = 'json'

// Interceptor para requisições
axios.interceptors.request.use(
  (config) => {
    // Adicionar token se existir (token já vem com Bearer da API)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para respostas
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratar erro 401 (não autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Limpar headers do axios
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/'
      return Promise.reject(error)
    }
    
    // Exibir toast para outros erros (exceto 401 que redireciona)
    if (error.response?.status && error.response.status !== 401) {
      const { addToast } = useToast()
      let errorData = error.response.data
      
      // Se errorData ainda for um Blob (fallback), usar mensagem baseada no status
      if (errorData instanceof Blob) {
        const statusMessages = {
          403: 'Acesso negado. Você não tem permissão para esta ação.',
          404: 'Recurso não encontrado.',
          409: 'Conflito. O recurso já existe.',
          422: 'Dados inválidos. Verifique os campos preenchidos.',
          500: 'Erro interno do servidor. Tente novamente mais tarde.'
        }
        errorData = {
          errors: [{ message: statusMessages[error.response.status] || 'Erro no servidor' }]
        }
      }
      
      const message = errorData?.errors?.[0]?.message || errorData?.message || 'Erro no servidor'
      addToast(message, 'error', 6000)
    } else if (!error.response) {
      // Erro de rede
      const { addToast } = useToast()
      addToast('Erro de conexão. Verifique sua internet e tente novamente.', 'error', 6000)
    }
    
    return Promise.reject(error)
  }
)

export default axios