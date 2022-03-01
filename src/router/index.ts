import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/index.vue'
import GenerateRouter from "@/modules/menu_read/read"
let routerData = new GenerateRouter();
const generateRoute: Array<RouteRecordRaw> = routerData.handleRouteData(routerData.menuData, '');
let routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/arrangeImage',
    name: 'arrangeImage',
    component: () => import("../views/image/arrangeImage.vue"),
  }
]
routes = routes.concat(generateRoute);
console.log(routes)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
console.log(router.getRoutes())
export default router
