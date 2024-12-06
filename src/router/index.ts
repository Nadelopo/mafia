import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import('../views/Welcome.vue')
    },
    {
      path: '/game/:gameId',
      name: 'Game',
      component: () => import('../views/Game')
    },
    {
      path: '/create-game',
      name: 'CreateGame',
      component: () => import('../views/CreateGame.vue')
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/Auth.vue'),
      meta: { notRequiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const notRequireAuth = to.matched.some(
    (record) => record.meta.notRequiresAuth
  )

  if (from.name === to.name) return

  if (notRequireAuth) return true

  const { isUserAuthenticated } = useUserStore()
  const isAuthenticated = await isUserAuthenticated()
  if (!isAuthenticated) return { name: 'Auth' }

  const { currentGameId } = storeToRefs(useGameStore())
  if (to.name !== 'Game') {
    if (currentGameId.value) {
      return { name: 'Game', params: { gameId: currentGameId.value } }
    }
  }
  return true
})

export default router
