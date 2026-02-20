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
    //Field
    {
      path: '/field/create',
      name: 'createField',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/field/CreateFieldView.vue'),
    },
    {
      path: '/field',
      name: 'fieldList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/field/ListFieldView.vue'),
    },
    {
      path: '/field/:id',
      name: 'field',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/field/FieldView.vue'),
      props: true
    },
    // Received Product
    {
      path: '/received-product/create',
      name: 'createReceivedProduct',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/receivedproduct/CreateReceivedProductView.vue'),
    },
    {
      path: '/received-product',
      name: 'receivedProductList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/receivedproduct/ListReceivedProductView.vue'),
    },
    // Action Taken
    {
      path: '/action-taken',
      name: 'actionTakenList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/actiontaken/ListActionTakenView.vue'),
    },
    {
      path: '/action-taken/create',
      name: 'createActionTaken',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/actiontaken/CreateActionTakenView.vue'),
    },
    // Selled Product
    {
      path: '/selled-product',
      name: 'selledProductList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/selledproduct/ListSelledProductView.vue'),
    },
    {
      path: '/selled-product/create',
      name: 'createSelledProduct',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/selledproduct/CreateSelledProductView.vue'),
    },
    // Error Page
    {
      path: '/error-page',
      name: 'errorPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ErrorView.vue'),
    },
    // Inventory
    {
      path: '/inventory',
      name: 'inventoryList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/inventory/ListInventoryView.vue'),
    },
    // Harvest
    {
      path: '/harvest/create',
      name: 'createHarvest',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/harvest/CreateHarvestView.vue'),
    },
    {
      path: '/harvest',
      name: 'harvestList',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/harvest/ListHarvestView.vue'),
    },
  ],
})

export default router
