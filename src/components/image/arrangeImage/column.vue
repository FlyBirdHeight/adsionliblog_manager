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
        @dblclick="showPreview(data)"
        @contextmenu.prevent="clickRight($event, data)"
        class="file-list-column_item"
        :class="checkedValue.indexOf(data.index) !== -1 ? 'file-list-column_item-active' : ''"
      >
        <el-icon><component :is="$icon[data.icon]" /></el-icon>
        <span style="user-select: none">{{ data.name }}</span>
      </div>
    </template>
  </el-cascader-panel>
  <right-click-menu
    @refreshColumn="refreshColumn"
    @changeFileName="changeFileName"
    @closeRightList="closeRightList"
  ></right-click-menu>
  <image-preview
    :previewList="previewList"
    :previewIndex="previewIndex"
    :showPreview="showPreviewImage"
    @closePreview="handleExtraWindow"
  />
</template>
<script lang="ts">
export default {
  name: 'FileColumn',
}
</script>
<script lang="ts" setup>
import { ref, shallowRef, provide, watchEffect, nextTick, inject, defineEmits, watch, onMounted, isReactive } from 'vue'
import {
  MenuDataList,
  getMenuData,
  returnMenuData,
  getDirectoryList,
  handleGetDirectoryListData,
  getDirectoryPathList,
} from '@/plugin/image/arrangeImage/arrange'
import RightClickMenu from '@/components/image/arrangeImage/right_menu'
import ImagePreview from '@/components/utils/image_preview.vue'
const emit = defineEmits(['setFilePath', 'setShowFileList'])
const list = ref<Map<string, MenuDataList>>(new Map())
/**
 * @property {MenuDataList} rightClickData 右键点击时的数据
 * @property {boolean} showRightList 是否显示右键列表
 * @property {number[]} showPosition 右键菜单显示的位置
 * @property {string[]} menuCheckedFileData 文件路径组件选中位置的时候的数据
 * @property {[]} checkedValue 选中文件数组
 * @property {MenuDataList} currentData 当前最底层选中数据
 * @property {any} fileListColumn 用来获取ref顶级对象
 * @property {boolean} refreshCurrent 判断是否要刷新当前最底层选中数据
 * @property {string[]} previewList 预览显示列表
 * @property {number} previewIndex 预览显示起始位置
 * @property {boolean} showPreviewImage 显示图片预览
 * @property {boolean} refreshColumnShow 刷新分栏显示的数据
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
const emitPathList = ref<string[]>([])
const previewList = ref<string[]>([])
const previewIndex = ref<number>(0)
const showPreviewImage = ref<boolean>(false)
const refreshColumnShow = ref<boolean>(false)
let resolveFunc = new Map()
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
    emitPathList.value = emitData
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
 * @method lazyLoad 懒加载column数据列表
 */
const lazyLoad = async function (node, resolve, rename: boolean = false) {
  resolveFunc.set(node.level, resolve)
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
}
/**
 * @classdesc columnSetting 专门用来处理分栏显示时，懒加载以及相关数据处理的内容
 */
const columnSetting = {
  lazy: true,
  //NOTE: 这里的触发条件是当前结构下没有children时触发，一般情况下不触发的
  lazyLoad: lazyLoad,
  value: 'index',
  label: 'name',
  children: 'children',
  multiple: false,
  leaf: 'is_file',
}
watch([menuCheckedFileData, refreshColumnShow], (newV, oldV) => {
  if (newV[0].length != 0) {
    fileListColumn.value.menus.splice(newV[0].length + 1, fileListColumn.value.menus.length - newV[0].length)
    fileListColumn.value.menuList.splice(newV[0].length + 1, fileListColumn.value.menuList.length - newV[0].length)

    checkedColumn(menuCheckedFileData.value)
  }
})
/**
 * @method getPathNode 获取对应path的节点
 * @param {string[]} pathList
 * @param {*} data
 */
const getPathNode = (pathList: string[], data: any) => {
  let pathNode = null
  for (let v of fileListColumn.value.menus[pathList.length - 1]) {
    if (v.value === data.index) {
      pathNode = v
      break
    }
  }

  return pathNode
}
/**
 * @method judgeIsExistEmitPath 判断是否是选中列表中的path
 * @param {*} data
 * @return {boolean}
 */
const judgeIsExistEmitPath = (data: any): boolean => {
  let updateLoad = false
  for (let v of emitPathList.value) {
    if (v.value === data.index) {
      updateLoad = true
      break
    }
  }

  return updateLoad
}
/**
 * @method updateColumnShowData 更新分栏显示内容
 * @param {*} data 修改的数据
 * @param {*} pathList list中当前节点的数据
 * @param {*} pathNode 当前cascaderPanel的节点数据
 */
const updateColumnShowData = async (data, pathList, pathNode) => {
  if (checkedValue.value.indexOf(data.index) == checkedValue.value.length - 1) {
    await columnSetting.lazyLoad(pathNode, resolveFunc.get(pathList.length))
  } else {
    fileListColumn.value.menuList.splice(pathList.length, fileListColumn.value.menuList.length - pathList.length)
    await columnSetting.lazyLoad(pathNode, resolveFunc.get(pathList.length))
  }
  emit('setShowFileList', pathList)
  fileListColumn.value.menus[pathList.length] = pathNode.children
}
/**
 * @method changeFileName 修改名称触发列表重载的回调
 * @param {*} data
 */
const changeFileName = async (data: any) => {
  let menuData = handleGetDirectoryListData(list.value, data.index)
  if (data.type === 'file') {
    menuData.url = menuData.url.replace(menuData.name, data.name)
    menuData.name = data.name
  } else {
    let updateLoad = judgeIsExistEmitPath(data)
    let pathList = getDirectoryPathList(data.index)
    let pathNode = getPathNode(pathList, data)
    //NOTE: 这里是为了重新加载当前目录下内容，因为不重新加载，数据还是旧的
    let listValue = handleGetDirectoryListData(list.value, data.index)
    listValue.relative_path = listValue.relative_path.replace(listValue.name, data.name)
    listValue.name = data.name
    listValue.children = []
    listValue.getChildren = false
    pathNode.loaded = false
    pathNode.children = []
    pathNode.childrenData = []
    pathNode.label = data.name
    pathNode.pathLabels.pop()
    pathNode.pathLabels.push(data.name)
    if (updateLoad) {
      await updateColumnShowData(data, pathList, pathNode)
    }
  }
}
/**
 * @method refreshColumn 刷新指定分栏数据，再删除或者新建时，触发
 * @param {boolean} val
 * @param {boolean} isDelete 是否是删除时触发
 */
const refreshColumn = async (val: boolean, isDelete: boolean = false) => {
  let refreshList = rightClickData.value
  let pathList = getDirectoryPathList(refreshList.index)
  let pathNode = getPathNode(pathList, refreshList)
  let updateLoad = judgeIsExistEmitPath(refreshList)
  let listValue = handleGetDirectoryListData(list.value, refreshList.index)
  if (isDelete) {
    let level = pathList.length
    let deleteIdx = 0
    fileListColumn.value.menus[level - 1].forEach((v, idx) => {
      if (v.value == refreshList.index) {
        deleteIdx = idx
      }
    })
    fileListColumn.value.menus[level - 1].splice(deleteIdx, 1)
    if (updateLoad) {
      pathList.pop()
      emit('setShowFileList', pathList)
    }
    return
  }
  //NOTE: 这里是为了重新加载当前目录下内容，因为不重新加载，数据还是旧的
  listValue.children = []
  listValue.getChildren = false
  pathNode.loaded = false
  pathNode.children = []
  pathNode.childrenData = []
  if (updateLoad) {
    await updateColumnShowData(refreshList, pathList, pathNode)
  }
}
/**
 * @method clickRight 右键点击事件
 * @param {any} event 节点Event返回
 * @param {MenuDataList} data 右键选中的数据
 */
const clickRight = (event, data: MenuDataList) => {
  rightClickData.value = {
    id: data.id,
    type: data.is_directory ? 'directory' : 'file',
    name: data.name,
    index: data.index,
  }
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
 * @method showPreview 点击图片时，双击显示预览图
 */
const showPreview = (data) => {
  if (data.is_directory) {
    return
  }
  previewList.value = [data.url]
  previewIndex.value = 0
  showPreviewImage.value = true
}
/**
 * @method handleExtraWindow 关闭额外的窗口显示
 * @param {boolean} val 显隐控制
 */
const handleExtraWindow = (val: boolean) => {
  showPreviewImage.value = false
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
