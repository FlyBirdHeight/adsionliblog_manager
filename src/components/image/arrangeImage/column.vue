<template>
  <el-cascader-panel
    v-model="checkedValue"
    @expand-change="checkedColumn"
    ref="fileListColumn"
    class="file-list-column"
    :props="columnSetting"
  >
    <template #default="{ node, data }">
      <div
        @contextmenu.prevent="clickRight($event, data)"
        class="file-list-column_item"
        :class="checkedValue.indexOf(data.index) !== -1 ? 'file-list-column_item-active' : ''"
      >
        <el-icon><component :is="$icon[data.icon]" /></el-icon>
        <span>{{ data.name }}</span>
      </div>
    </template>
  </el-cascader-panel>
  <right-click-menu @changeFileName="changeFileName" @closeRightList="closeRightList"></right-click-menu>
</template>
<script lang="ts">
export default {
  name: 'FileColumn',
}
</script>
<script lang="ts" setup>
import { ref, shallowRef, provide, watchEffect, nextTick, inject, defineEmits, watch, onMounted } from 'vue'
import {
  MenuDataList,
  getMenuData,
  returnMenuData,
  getDirectoryList,
  handleGetDirectoryListData,
} from '@/plugin/image/arrangeImage/arrange'
import RightClickMenu from '@/components/image/arrangeImage/right_menu'
const emit = defineEmits(['setFilePath'])
const list = ref<Map<string, MenuDataList>>(new Map())
/**
 * @method clickRight 右键点击事件
 * @param {any} event 节点Event返回
 * @param {MenuDataList} data 右键选中的数据
 */
const clickRight = (event, data: MenuDataList) => {
  rightClickData.value = data
  showRightList.value = true
  showPosition.value = [event.clientX, event.clientY]
}
/**
 * @method closeRightList 关闭右键菜单
 */
const closeRightList = () => {
  showRightList.value = false
}
/**
 * @property {MenuDataList} rightClickData 右键点击时的数据
 * @property {boolean} showRightList 是否显示右键列表
 * @property {number[]} showPosition 右键菜单显示的位置
 * @property {string[]} menuCheckedFileData 文件路径组件选中位置的时候的数据
 * @property {[]} checkedValue 选中文件数组
 * @property {MenuDataList} currentData 当前最底层选中数据
 * @property {any} fileListColumn 用来获取ref顶级对象
 * @property {boolean} refreshCurrent 判断是否要刷新当前最底层选中数据
 */
const rightClickData = ref<MenuDataList>({})
const showRightList = ref<boolean>(false)
const showPosition = ref<number[]>([0, 0])
provide('rightClickData', rightClickData)
provide('showRight', showRightList)
provide('showPosition', showPosition)
const menuCheckedFileData = inject('menuFileChecked')
const checkedValue = ref([])
const currentData = ref<MenuDataList>(null)
const fileListColumn = ref()
const refreshCurrent = ref<boolean>(false)
/**
 * @method checkedColumn 展开节点发生改变时候的回调
 */
const checkedColumn = (value) => {
  checkedValue.value = value
  //这里需要返回一个路径列表，给到文件路径组件中
  nextTick(() => {
    let emitData = []
    let findList = list.value

    for (let v of value) {
      findList = getDirectoryList(v, findList, Math.floor((v.split('-').length + 1) / 2))
      emitData.push({
        name: findList.name,
        value: v,
      })
    }
    emit('setFilePath', emitData)
    if (!refreshCurrent.value) {
      let length = value.length
      let currentIndex = value[length - 1]
      currentData.value = handleGetDirectoryListData(list.value, currentIndex)
    }
    refreshCurrent.value = false
    scrollToRight()
  })
}
/**
 * @method scrollToRight 设置滚动条移动到最右侧
 */
const scrollToRight = () => {
  return (() => {
    let el = fileListColumn.value.$.vnode.el
    let children = el.children
    el.scrollTo({
      left: children[children.length - 1].getBoundingClientRect().x,
      behavior: 'smooth',
    })
  })()
}
/**
 * @classdesc columnSetting 专门用来处理分栏显示时，懒加载以及相关数据处理的内容
 */
const columnSetting = {
  lazy: true,
  //NOTE: 这里的触发条件是当前结构下没有children时触发，一般情况下不触发的
  async lazyLoad(node, resolve) {
    let data = []
    refreshCurrent.value = true
    if (node.level == 0) {
      list.value = await getMenuData({ id: 1 }, true)
      data = returnMenuData(list.value)
      currentData.value = null
    } else if (node.data.is_directory) {
      currentData.value = node.data
      data = await getMenuData(currentData.value, false)
    } else if (node.data.is_file) {
      data = undefined
    }
    resolve(data)
    nextTick(() => {
      scrollToRight()
    })
  },
  value: 'index',
  label: 'name',
  children: 'children',
  multiple: false,
  leaf: 'is_file',
}

watch(menuCheckedFileData, (newV, oldV) => {
  if (newV.length != 0) {
    fileListColumn.value.menus.splice(newV.length + 1, fileListColumn.value.menus.length - newV.length)
    checkedColumn(menuCheckedFileData.value)
  }
})
/**
 * @method changeFileName 修改名称
 * @param {*} data
 */
const changeFileName = (data: any) => {
  let menuData = handleGetDirectoryListData(list.value, data.index)
  if (data.type === 'file') {
    menuData.url = menuData.url.replace(menuData.name, data.name)
    menuData.name = data.name
  }
}
</script>
<style lang="scss">
.file-list-column {
  .el-cascader-menu:last-child {
    border-right: 1px solid #e4e7ed;
  }
  .el-cascader-menu__wrap.el-scrollbar__wrap {
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.file-list-column {
  height: 70vh;
  width: 100%;
  overflow-x: auto;
  .file-list-column_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  .file-list-column_item-active {
    font-weight: 700;
    color: #409eff;
  }
}
.file-list-column::-webkit-scrollbar {
  -webkit-appearance: none;
}
.file-list-column::-webkit-scrollbar:horizontal {
  height: 10px;
}
.file-list-column::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgb(81, 193, 238, 0.2);
}
.file-list-column::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
}
</style>
