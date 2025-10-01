<template>
  <v-app>
    <!-- Layout completo com cabeçalho e rodapé para outras páginas -->
    <template v-if="!isFormularioRoute && !isLoginRoute">
      <v-app-bar
        color="primary"
        dark
        prominent
        elevation="4"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-toolbar-title>
          <router-link to="/" class="text-decoration-none text-white">
            Challenge L0gik
          </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-if="!authStore.isAuthenticated"
          to="/formulario"
          color="white"
          variant="outlined"
          class="mr-2"
        >
          <v-icon left>mdi-form-select</v-icon>
          Formulário
        </v-btn>

        <v-btn
          v-if="!authStore.isAuthenticated"
          to="/admin"
          color="white"
          variant="outlined"
        >
          <v-icon left>mdi-login</v-icon>
          Login
        </v-btn>

        <v-menu v-if="authStore.isAuthenticated" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              color="white"
              variant="outlined"
              v-bind="props"
            >
              <v-icon left>mdi-account</v-icon>
              {{ authStore.user?.username }}
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item to="/admin/leads">
              <v-list-item-title>
                <v-icon left>mdi-account-group</v-icon>
                Leads
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-icon left>mdi-logout</v-icon>
                Sair
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        temporary
        color="primary"
        dark
      >
        <v-list>
          <v-list-item to="/" prepend-icon="mdi-home">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/formulario" prepend-icon="mdi-form-select">
            <v-list-item-title>Formulário</v-list-item-title>
          </v-list-item>
          
          <v-list-item v-if="authStore.isAuthenticated" to="/admin/leads" prepend-icon="mdi-account-group">
            <v-list-item-title>Leads</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>

      <v-footer
        color="primary"
        dark
        class="text-center footer-limited"
      >
        <v-container>
          <v-row>
            <v-col cols="12">
              <p class="mb-0">
                © 2025 Challenge L0gik - Jonathan Alcantara - Sistema de Gestão de Leads
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </template>

    <!-- Layout isolado para formulário e login -->
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const drawer = ref(false)
    const authStore = useAuthStore()
    const route = useRoute()

    // Detectar se estamos na rota do formulário
    const isFormularioRoute = computed(() => {
      return route.path === '/formulario'
    })

    // Detectar se estamos na rota de login (página inicial)
    const isLoginRoute = computed(() => {
      return route.path === '/'
    })

    const logout = async () => {
      await authStore.logout()
      // Redirecionar para home após logout
      window.location.href = '/'
    }

    return {
      drawer,
      authStore,
      logout,
      isFormularioRoute,
      isLoginRoute
    }
  }
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.text-decoration-none {
  text-decoration: none !important;
}

.footer-limited {
  max-height: 100px !important;
  overflow: hidden;
}
</style>
