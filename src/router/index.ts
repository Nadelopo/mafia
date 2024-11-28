import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import('../views/Game.vue')
    },
    {
      path: '/create-game',
      name: 'CreateGame',
      component: () => import('../views/CreateGame.vue')
    }
  ]
})

export default router
