import { Module } from 'vuex';
//暴露给外部进行类型效验
export interface DialogShow {
    categoryAddShow: boolean
}

export default {
    /**
     * @property {Boolean} categoryAddShow 分类添加栏的开闭状态 
     */
    state: {
        categoryAddShow: false
    },
    mutations: {
        setCategoryAddShow(state, code: boolean) {
            state.categoryAddShow = code;
        }
    },
    getters: {
        getCategoryAddShow(state): boolean {
            return state.categoryAddShow
        }
    },
    namespaced: true
} as Module<DialogShow, Object>