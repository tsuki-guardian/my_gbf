import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/my_gbf',
    children: [
      {
        path: '/my_gbf',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/my_gbf/about',
        name: 'About',
        component: () => import('../views/About.vue')
      },
      {
        path: '/my_gbf/gacha-parse',
        name: 'GachaParse',
        component: () => import('../views/GachaParse.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
