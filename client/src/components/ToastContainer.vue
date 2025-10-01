<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-item"
      :class="{ 'toast-enter': toast.visible, 'toast-leave': !toast.visible }"
    >
      <v-snackbar
        v-model="toast.visible"
        :color="getToastColor(toast.type)"
        :timeout="toast.duration"
        location="top right"
        variant="elevated"
        @update:model-value="removeToast(toast.id)"
      >
        <div class="d-flex align-center">
          <v-icon :icon="getToastIcon(toast.type)" class="mr-3"></v-icon>
          <span>{{ toast.message }}</span>
        </div>
        
        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="removeToast(toast.id)"
          ></v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'

export default {
  name: 'ToastContainer',
  setup() {
    const { toasts, removeToast } = useToast()
    
    const getToastColor = (type) => {
      switch (type) {
        case 'success':
          return 'success'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        case 'error':
        default:
          return 'error'
      }
    }
    
    const getToastIcon = (type) => {
      switch (type) {
        case 'success':
          return 'mdi-check-circle'
        case 'warning':
          return 'mdi-alert-circle'
        case 'info':
          return 'mdi-information'
        case 'error':
        default:
          return 'mdi-alert-circle'
      }
    }
    
    return {
      toasts,
      removeToast,
      getToastColor,
      getToastIcon
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  margin-bottom: 10px;
  max-width: 400px;
}

/* Animações de entrada e saída */
.toast-item {
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateX(0);
}

.toast-item.toast-enter {
  opacity: 1;
  transform: translateX(0);
}

.toast-item.toast-leave {
  opacity: 0;
  transform: translateX(100%);
}
</style>
