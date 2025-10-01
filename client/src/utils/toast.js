/**
 * Utilitário para exibir toasts globalmente
 * Pode ser usado em qualquer componente ou store
 */

import { useToast } from '@/composables/useToast'

/**
 * Exibe um toast de erro
 * @param {string} message - Mensagem do erro
 * @param {number} duration - Duração em ms (padrão: 6000)
 */
export const showError = (message, duration = 6000) => {
  const { addToast } = useToast()
  return addToast(message, 'error', duration)
}

/**
 * Exibe um toast de sucesso
 * @param {string} message - Mensagem de sucesso
 * @param {number} duration - Duração em ms (padrão: 4000)
 */
export const showSuccess = (message, duration = 4000) => {
  const { addToast } = useToast()
  return addToast(message, 'success', duration)
}

/**
 * Exibe um toast de aviso
 * @param {string} message - Mensagem de aviso
 * @param {number} duration - Duração em ms (padrão: 5000)
 */
export const showWarning = (message, duration = 5000) => {
  const { addToast } = useToast()
  return addToast(message, 'warning', duration)
}

/**
 * Exibe um toast informativo
 * @param {string} message - Mensagem informativa
 * @param {number} duration - Duração em ms (padrão: 4000)
 */
export const showInfo = (message, duration = 4000) => {
  const { addToast } = useToast()
  return addToast(message, 'info', duration)
}
