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
  <right-click-menu @closeRightList="closeRightList"></right-click-menu>
</template>
<script lang="ts">
export default {
  name: 'FileColumn',
}
</script>
<script lang="ts" setup>
import { ref, provide, watch, watchEffect, nextTick } from 'vue'
import { MenuDataList, getMenuData, returnMenuData, getDirectoryList } from '@/plugin/image/arrangeImage/arrange'
import RightClickMenu from '@/components/image/arrangeImage/right_menu'
const list = ref<Map<string, MenuDataList>>(new Map())
list.value = new Map().set('1', {
  id: 1,
  index: '1',
  name: 'public',
  created_at: '2022-04-10',
  is_directory: true,
  is_file: false,
  icon: 'Folder',
  size: 0,
  parent_id: 0,
  level: 0,
  getChildren: false,
  children: new Map<string, MenuDataList>(),
})
for (let i = 2; i < 30; i++) {
  list.value.set(i.toString(), {
    id: i,
    index: i.toString(),
    name: 'public' + i,
    created_at: '2022-04-10',
    is_directory: true,
    is_file: false,
    icon: 'Folder',
    size: 0,
    parent_id: 0,
    getChildren: false,
    level: 0,
    children: new Map<string, MenuDataList>(),
  })
}

const clickRight = (event, data) => {
  rightClickData.value = getDirectoryList(String(data.index).substr(0).split('-'), list.value)
  showRightList.value = true
  showPosition.value = [event.clientX, event.clientY]
}
const closeRightList = () => {
  showRightList.value = false
}
/**
 * @property {MenuDataList} rightClickData 右键点击时的数据
 * @property {boolean} showRightList 是否显示右键列表
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
const checkedValue = ref([])
const currentData = ref<MenuDataList>(null)
const fileListColumn = ref()
const refreshCurrent = ref<boolean>(false)
nextTick(() => {
  console.log(fileListColumn)
})
/**
 * @method checkedColumn 展开节点发生改变时候的回调
 */
const checkedColumn = (value) => {
  checkedValue.value = value
  nextTick(() => {
    if (!refreshCurrent.value) {
      let length = value.length
      let currentIndex = value[length - 1]
      let idList = currentIndex.split('-')
      currentData.value = getDirectoryList(idList, list.value)
    }
    console.log(currentData.value)
    refreshCurrent.value = false
  })
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
      data = returnMenuData(list.value)
      currentData.value = null
    } else if (node.data.is_directory) {
      currentData.value = node.data
      data = await getMenuData(currentData.value, node.level, currentData.value.index)
    }
    resolve(data)
    nextTick(() => {
      let el = fileListColumn.value.$.vnode.el
      let children = el.children
      el.scrollTo({
        left: children[children.length - 1].getBoundingClientRect().x,
        behavior: 'smooth',
      })
    })
  },
  value: 'index',
  label: 'name',
  children: 'children',
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
