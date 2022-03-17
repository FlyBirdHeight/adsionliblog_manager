import { Module } from 'vuex';
//暴露给外部进行类型效验
export interface DialogShow {
    categoryAddShow: boolean
    tagAddShow: boolean
}

export default {
    /**
     * @property {Boolean} categoryAddShow 分类添加栏的开闭状态 
     * @property {Boolean} tagAddShow 标签添加栏的开闭状态
     */
    state: {
        categoryAddShow: false,
        tagAddShow: false,
    },
    mutations: {
        setCategoryAddShow(state, code: boolean) {
            state.categoryAddShow = code;
        },
        setTagAddShow(state, code: boolean) {
            state.tagAddShow = code;
        }
    },
    getters: {
        getCategoryAddShow(state): boolean {
            return state.categoryAddShow
        },
        getTagAddShow(state): boolean {
            return state.tagAddShow
        }
    },
    namespaced: true
} as Module<DialogShow, Object>