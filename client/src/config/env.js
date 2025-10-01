// Configurações de ambiente
export const env = {
  // URL da API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Nome da aplicação
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Challenge L0gik',
  
  // Versão da aplicação
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Ambiente atual
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Configurações de desenvolvimento
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}

// Função para obter a URL da API
export const getApiUrl = () => env.API_URL

// Função para verificar se está em desenvolvimento
export const isDev = () => env.DEV

// Função para verificar se está em produção
export const isProd = () => env.PROD

export default env
