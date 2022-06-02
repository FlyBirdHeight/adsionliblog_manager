import * as Icons from "@element-plus/icons-vue";
console.log(Icons);

import { reactive } from 'vue';
const dictIcon = reactive(Icons);

const installIcon = (app: any) => {
    app.config.globalProperties.$icon = dictIcon
}

export default installIcon