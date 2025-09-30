import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { mask } from './directives/mask'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.directive('mask', mask)

app.mount('#app')
