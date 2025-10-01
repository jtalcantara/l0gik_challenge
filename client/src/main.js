import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { mask } from './directives/mask'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.directive('mask', mask)

// Inicializar autenticação após criar o Pinia
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
