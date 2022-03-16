import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/scss/index.scss';
import installIcon from '@/utils/ImportIcon'
import 'element-plus/theme-chalk/el-scrollbar.css'

const app = createApp(App)
app.use(store).use(router).use(installIcon).mount('#app')
