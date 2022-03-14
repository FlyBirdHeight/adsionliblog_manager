import { createStore } from 'vuex'
import menu, { MenuState } from './modules/utils/menu'
import dialog, { DialogShow } from './modules/utils/dialog'

//这里是为了让外部可以进行类型验证的
export interface State {
  menu: MenuState,
  dialog: DialogShow
}


const store = createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    menu,
    dialog
  }
})

export default store