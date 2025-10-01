import { ref } from 'vue'

// Estado global dos toasts
const toasts = ref([])
let toastId = 0

export const useToast = () => {
  const addToast = (message, type = 'error', duration = 5000) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    // Auto-remover após a duração especificada
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].visible = false
      // Remover do array após a animação
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 300)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value.forEach(toast => {
      toast.visible = false
    })
    setTimeout(() => {
      toasts.value = []
    }, 300)
  }
  
  return {
    toasts: toasts.value,
    addToast,
    removeToast,
    clearAllToasts
  }
}

// Exportar o estado global para uso em componentes
export const globalToasts = toasts
