import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth.vue')
    },
    {
      path: '/',
      name: 'Card',
      component: () => import('@/views/Card.vue')
    }
  ]
})

export default router
