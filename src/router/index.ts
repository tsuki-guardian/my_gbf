import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/my_gbf',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
      },
      {
        path: '/gacha-parse',
        name: 'GachaParse',
        component: () => import('../views/GachaParse.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
