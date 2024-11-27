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
      path: '/game/:roomId',
      name: 'Game',
      component: () => import('../views/Game.vue')
    },
    {
      path: '/creater-room',
      name: 'CreateRoom',
      component: () => import('../views/CreateRoom.vue')
    }
  ]
})

export default router
