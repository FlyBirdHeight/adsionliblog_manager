import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/scss/index.scss';
// import '../public/scss/mixin.scss';
import installIcon from '@/utils/ImportIcon'
import IconFont from "@/components/utils/icon.vue"
import OpenIcon from "@/components/utils/icon/open.vue"
import 'element-plus/theme-chalk/el-scrollbar.css'
import 'element-plus/theme-chalk/el-loading.css'
import { vLoading } from 'element-plus/es/components/loading/src/directive'
import "default-passive-events"

const app = createApp(App)
app.directive("load", vLoading)
app.component('icon-font', IconFont)
app.component('open-icon', OpenIcon)
app.use(store).use(router).use(installIcon).mount('#app')
