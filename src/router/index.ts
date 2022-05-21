import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/index.vue'
import GenerateMenuData from "@/modules/menu_read/read"
let routerData = new GenerateMenuData();
const generateRoute: Array<RouteRecordRaw> = routerData.handleRouteData(routerData.menuData, '');

let routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    redirect: '/adsionli-home'
  }
]
routes = routes.concat(generateRoute);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router
