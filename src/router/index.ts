import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../config/navigation'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
