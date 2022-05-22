import { Module } from 'vuex';
type RouterInfo = {
    name: string, router: string, componentName: string
}
//暴露给外部进行类型效验
export interface HeaderList {
    activeRouter: RouterInfo | null,
    routerList: RouterInfo[],
}

export default {
    /**
     * @property {RouterInfo | null} activeRouter 当前打开的router信息
     * @property {RouterInfo[]} routerList 未关闭的router列表
     */
    state: {
        activeRouter: {
            name: '',
            router: '',
            componentName: ''
        },
        routerList: [],
        fullList: [],
    },
    mutations: {
        /**
         * @method setActiveRouter 设置当前选中的router信息
         * @param {*} state 
         * @param {RouterInfo} code 设置内容
         */
        setActiveRouter(state, code: RouterInfo) {
            state.activeRouter = code;
        },
        /**
         * @method pushInRouterList 当打开新的内容时，放入router信息
         * @param {*} state 
         * @param {RouterInfo} code 设置内容
         */
        pushInRouterList(state, code: RouterInfo) {
            if (state.routerList.findIndex(v => v.router == code.router) !== -1) {
                return;
            }
            state.routerList.push(code);
        },
        /**
         * @method setRouterList 设置routerList内容
         * @param {*} state 
         * @param {RouterInfo[]} code 设置内容
         */
        setRouterList(state, code: RouterInfo[]) {
            state.routerList = code;
        },
        /**
         * @method spliceDataForRouterList 清除routerList指定内容（关闭tag时调用）
         * @param {*} state 
         * @param {RouterInfo} code 清除内容
         */
        spliceDataForRouterList(state, code: RouterInfo) {
            let idx = state.routerList.findIndex((v: RouterInfo) => v.router == code.router);
            if (idx == -1) {
                return;
            }
            state.routerList.splice(idx, 1);
        },
        /**
         * @method resetRouterList 重置routerList内容
         * @param {*} state 
         */
        resetRouterList(state) {
            state.routerList = [];
        }
    },
    getters: {
        getActiveRouter(state): RouterInfo | null {
            return state.activeRouter
        },
        getRouterList(state): RouterInfo[] {
            return state.routerList
        }
    },
    namespaced: true
} as Module<HeaderList, Object>