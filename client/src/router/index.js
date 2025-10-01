import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { 
      title: 'Painel Administrativo'
    }
  },
  {
    path: '/formulario',
    name: 'Formulario',
    component: () => import('@/views/Formulario.vue'),
    meta: { title: 'Formulário de Cadastro' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/Admin.vue'),
    meta: { 
      title: 'Painel Administrativo',
      requiresAuth: true 
    }
  },
  {
    path: '/admin/leads',
    name: 'LeadsList',
    component: () => import('@/views/admin/LeadsList.vue'),
    meta: { 
      title: 'Lista de Leads',
      requiresAuth: true 
    }
  },
  {
    path: '/admin/leads/:id',
    name: 'LeadDetail',
    component: () => import('@/views/admin/LeadDetail.vue'),
    meta: { 
      title: 'Detalhes do Lead',
      requiresAuth: true 
    }
  },
  {
    path: '/admin/leads/:id/edit',
    name: 'LeadEdit',
    component: () => import('@/views/admin/LeadEdit.vue'),
    meta: { 
      title: 'Editar Lead',
      requiresAuth: true 
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Verificar se há token
    if (!authStore.isAuthenticated) {
      console.warn('Rota protegida acessada sem autenticação')
      next('/')
      return
    }
    
    // Verificar se o token ainda é válido
    try {
      const isValid = await authStore.verifyToken()
      if (!isValid) {
        console.warn('Token inválido, redirecionando para login')
        next('/')
        return
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      next('/')
      return
    }
  }
  
  next()
})

export default router
