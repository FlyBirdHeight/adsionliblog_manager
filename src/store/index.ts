import { createStore } from 'vuex'
import menu, { MenuState } from './modules/utils/menu'

//这里是为了让外部可以进行类型验证的
export interface State {
  menu: MenuState
}


const store = createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    menu
  }
})

export default store