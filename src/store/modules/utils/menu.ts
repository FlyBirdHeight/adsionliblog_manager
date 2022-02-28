import { Module } from 'vuex';
//暴露给外部进行类型效验
export interface MenuState {
    showMenu: boolean
}

export default {
    /**
     * @property {Boolean} showMenu 是否展开侧边栏 
     */
    state: {
        showMenu: true
    },
    mutations: {
        SET_SHOW_MENU(state, code: boolean) {
            state.showMenu = code;
        }
    },
    getters: {
        getShowMenu(state): boolean {
            return state.showMenu
        }
    },
    namespaced: true
} as Module<MenuState, Object>