import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import('../views/Welcome.vue')
    },
    {
      path: '/game/:roomId',
      name: 'Game',
      component: () => import('../views/Game.vue')
    },
    {
      path: '/create-room',
      name: 'CreateRoom',
      component: () => import('../views/CreateRoom.vue')
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth.vue'),
      meta: { notRequiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const notRequireAuth = to.matched.some(
    (record) => record.meta.notRequiresAuth
  )
  if (notRequireAuth) return true
  const { isUserAuthenticated } = useUserStore()
  const isAuthenticated = await isUserAuthenticated()
  if (!isAuthenticated) return { name: 'Auth' }
  return true
})

export default router
