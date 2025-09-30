<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-row no-gutters class="hero-section">
      <v-col cols="12" class="d-flex align-center justify-center pa-8">
        <div class="text-center">
          <h1 class="text-h2 font-weight-bold mb-4 text-white">
            Challenge L0gik
          </h1>
          <p class="text-h5 text-white mb-8">
            Sistema Completo de Gestão de Leads
          </p>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-card elevation="8" class="pa-6">
                <v-card-title class="text-h4 text-center mb-4">
                  <v-icon color="primary" size="large" class="mr-2">mdi-rocket-launch</v-icon>
                  Funcionalidades
                </v-card-title>
                <v-row>
                  <v-col cols="12" md="4" v-for="feature in features" :key="feature.title">
                    <v-card variant="outlined" class="pa-4 text-center h-100">
                      <v-icon :color="feature.color" size="48" class="mb-3">{{ feature.icon }}</v-icon>
                      <h3 class="text-h6 mb-2">{{ feature.title }}</h3>
                      <p class="text-body-2">{{ feature.description }}</p>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row class="mt-6">
                  <v-col cols="12" class="text-center">
                    <v-btn
                      to="/formulario"
                      color="primary"
                      size="large"
                      class="mr-4"
                    >
                      <v-icon left>mdi-form-select</v-icon>
                      Acessar Formulário
                    </v-btn>
                    <v-btn
                      to="/admin"
                      color="secondary"
                      size="large"
                      variant="outlined"
                    >
                      <v-icon left>mdi-login</v-icon>
                      Painel Admin
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-container class="py-12">
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="text-h3 font-weight-bold mb-4">Tecnologias Utilizadas</h2>
          <p class="text-h6 text-grey-darken-1">
            Stack moderna e robusta para desenvolvimento full-stack
          </p>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="4" v-for="tech in technologies" :key="tech.name">
          <v-card elevation="4" class="pa-6 text-center h-100">
            <v-icon :color="tech.color" size="64" class="mb-4">{{ tech.icon }}</v-icon>
            <h3 class="text-h5 mb-3">{{ tech.name }}</h3>
            <p class="text-body-1">{{ tech.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      features: [
        {
          title: 'Formulário Público',
          description: 'Formulário responsivo com validações e tracking UTM automático',
          icon: 'mdi-form-select',
          color: 'primary'
        },
        {
          title: 'API REST',
          description: 'API completa com autenticação, CRUD e exportação de dados',
          icon: 'mdi-api',
          color: 'success'
        },
        {
          title: 'Painel Admin',
          description: 'Interface administrativa para gestão completa de leads',
          icon: 'mdi-view-dashboard',
          color: 'info'
        }
      ],
      technologies: [
        {
          name: 'Vue.js 3',
          description: 'Framework JavaScript reativo para interfaces modernas',
          icon: 'mdi-vuejs',
          color: 'green'
        },
        {
          name: 'Node.js',
          description: 'Runtime JavaScript para backend escalável',
          icon: 'mdi-nodejs',
          color: 'green-darken-2'
        },
        {
          name: 'Vuetify',
          description: 'Framework Material Design para Vue.js',
          icon: 'mdi-material-design',
          color: 'blue'
        }
      ]
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  min-height: 80vh;
}

.v-card {
  border-radius: 16px;
}

.v-btn {
  border-radius: 8px;
}
</style>
