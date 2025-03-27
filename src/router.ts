import { createRouter, createWebHashHistory } from 'vue-router'
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
  },
  {
    path: '/plugin-form',
    name: 'Plugin Form (WIP)',
    component: () => import('./views/PluginForm.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
