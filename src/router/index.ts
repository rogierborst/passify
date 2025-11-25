import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/passes'
    },
    {
        path: '/passes',
        component: () => import ('../views/OverviewPage.vue')
    },
    {
        path: '/add',
        component: () => import ('../views/AddPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
