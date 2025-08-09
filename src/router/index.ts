import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/BodyView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BodyView.vue'),
    },
    //Equipment
    {
      path: '/equipment',
      name: 'equipmentList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/equipment/ListEquipmentView.vue'),
    },
    {
      path: '/equipment/create',
      name: 'createEquipment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/equipment/CreateEquipmentView.vue'),
    },
    {
      path: '/equipment/:id',
      name: 'equipment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/equipment/EquipmentView.vue'),
      props: true
    },
    //Maintenance
    {
      path: '/maintenance',
      name: 'maintenanceList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/maintenance/ListMaintenanceView.vue'),
    },
    {
      path: '/maintenance/create',
      name: 'createMaintenance',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/maintenance/CreateMaintenanceView.vue'),
    },
    {
      path: '/equipment/:id',
      name: 'equipment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/equipment/EquipmentView.vue'),
      props: true
    },
  ],
})

export default router
