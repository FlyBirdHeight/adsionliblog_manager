import { createStore } from 'vuex'
import menu, { MenuState } from './modules/utils/menu'
import dialog, { DialogShow } from './modules/utils/dialog'
import header, { HeaderList } from './modules/utils/header';

//这里是为了让外部可以进行类型验证的
export interface State {
  menu: MenuState,
  dialog: DialogShow,
  header: HeaderList
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
    dialog,
    header
  }
})

export default store