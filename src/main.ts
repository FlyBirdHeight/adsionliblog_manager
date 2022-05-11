import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/scss/index.scss';
import installIcon from '@/utils/ImportIcon'
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-loading.css'
import { vLoading } from 'element-plus/es/components/loading/src/directive'
import "default-passive-events"

const app = createApp(App)
app.directive("load", vLoading)
app.use(store).use(router).use(installIcon).mount('#app')
