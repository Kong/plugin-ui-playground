import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/cases',
    name: 'Cases',
    component: () => import('./views/Cases.vue'),
  },
  {
    path: '/schema-transformer',
    name: 'Schema Transformer',
    component: () => import('./views/SchemaTransformer.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
