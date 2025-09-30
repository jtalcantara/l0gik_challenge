import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/formulario',
    name: 'Formulario',
    component: () => import('@/views/Formulario.vue'),
    meta: { title: 'Formulário de Cadastro' }
  },
  {
    path: '/admin',
    name: 'Admin',
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

export default router
