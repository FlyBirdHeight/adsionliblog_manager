<template>
  <div class="router-header">
    <el-scrollbar always ref="menuItemListScroll">
      <div class="header-tag-list">
        <el-tag
          v-if="headerList.length != 0"
          v-for="(tag, index) in headerList"
          type="info"
          class="header-tag"
          closable
          :key="tag.name"
          :color="tag.router == activeRouter.router ? '#00b894' : ''"
          :effect="tag.router == activeRouter.router ? 'dark' : 'plain'"
          :style="{ border: tag.router === activeRouter.router ? 'none' : '' }"
          @click="changeShowRouter(tag)"
          @close="removeAliveRouter(tag)"
          @contextmenu.prevent="openRightMenu(tag, index, $event)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </el-scrollbar>
  </div>
  <mouse-right-click-menu class="menuList-container" @closeRightList="closeRightList">
    <template #menuList>
      <li @click.stop="closePanel('close')" class="menuList_item menuList_item_start">关闭标签页</li>
      <li @click.stop="closePanel('closeRight')" class="menuList_item">关闭右侧标签页</li>
      <li @click.stop="closePanel('closeLeft')" class="menuList_item">关闭左侧标签页</li>
      <li @click.stop="closePanel('closeOther')" class="menuList_item menuList_item_end">关闭其他标签页</li>
    </template>
  </mouse-right-click-menu>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, provide } from 'vue'
import { useState, useMutation } from '@/utils/store/map'
import { useRoute, useRouter } from 'vue-router'
import MouseRightClickMenu from '@/components/utils/mouse_click/right_click.vue'
export default {
  name: 'RouterHeader',
}
</script>
<script lang="ts" setup>
type RouterInfo = {
  name: string
  router: string
  componentName: string
}
const headerList = ref([])
const activeRouter = reactive<RouetrInfo>({})
//NOTE: 下面是处理vuex数据的
const storeState = useState('header', ['activeRouter', 'routerList'])
const storeMutation = useMutation('header', ['spliceDataForRouterList', 'setActiveRouter', 'pushInRouterList'])
const route = useRoute()
const router = useRouter()
/**
 * @method isActive 判断是否是当前打开标签页
 * @param {RouterInfo} tag 标签内容
 */
const isActive = (tag) => {
  return tag.router === activeRouter.router ? true : false
}
/**
 * @method changeShowRouter 修改显示的router
 */
const changeShowRouter = (tagInfo: RouterInfo) => {
  router.push(tagInfo.router)
}
/**
 * @method removeAliveRouter 移除保存的路由数据
 * @param {RouterInfo} tag 移除的路由信息
 */
const removeAliveRouter = (tag: RouterInfo) => {
  if (tag.router === activeRouter.router) {
    ElMessage({
      message: '正在开启的标签页无法关闭!',
      type: 'warning',
      grouping: true,
    })
    return
  }
  storeMutation.spliceDataForRouterList(tag)
}
const showRight = ref<boolean>(false)
const showPosition = reactive<{ top: number; left: number }>({ top: 0, left: 0 })
const rightCheckedData = reactive<{ tag: RouterInfo | null; index: number }>({ tag: null, index: 0 })
provide('showRight', showRight)
provide('showPosition', showPosition)
/**
 * @method openRightMenu 打开右键标签
 * @param {RouterInfo} tagInfo 右键标签信息
 * @param {number} index 右键标签下标
 */
const openRightMenu = (tagInfo: RouterInfo, index: number, event: any) => {
  rightCheckedData.tag = tagInfo
  rightCheckedData.index = index
  showPosition.top = event.clientY
  showPosition.left = event.clientX
  showRight.value = true
}
/**
 * @method closePanel 右键菜单操作，主要为关闭标签页
 * @param {string} type 关闭类型
 */
const closePanel = (type: string) => {
  showRight.value = false
  let templateData = null
  switch (type) {
    case 'close':
      if (isActive(rightCheckedData.tag)) {
        ElMessage({
          message: '正在开启的标签页无法关闭!',
          type: 'warning',
          grouping: true,
          duration: 1000,
        })
        return
      }
      storeMutation.spliceDataForRouterList(rightCheckedData.tag)
      break
    case 'closeRight':
      if (rightCheckedData.index === headerList.value.length - 1) {
        return
      }
      templateData = headerList.value.slice(rightCheckedData.index + 1)
      for (let v of templateData) {
        if (isActive(v)) {
          continue
        }
        storeMutation.spliceDataForRouterList(v)
      }
      break
    case 'closeLeft':
      if (rightCheckedData.index === 0) {
        return
      }
      templateData = headerList.value.slice(0, rightCheckedData.index)
      for (let v of templateData) {
        if (isActive(v)) {
          continue
        }
        storeMutation.spliceDataForRouterList(v)
      }
      break
    case 'closeOther':
      if (headerList.value.length === 1) {
        return
      }
      templateData = headerList.value
        .slice(0, rightCheckedData.index)
        .concat(headerList.value.slice(rightCheckedData.index + 1))
      for (let v of templateData) {
        if (isActive(v)) {
          continue
        }
        storeMutation.spliceDataForRouterList(v)
      }
      break
  }
}
/**
 * @method closeRightList 关闭右键菜单，是一个emit回调
 */
const closeRightList = () => {
  showRight.value = false
}

watch(route, (newV, oldV) => {
  newV.meta.keepAlive = true
  storeMutation.setActiveRouter({
    name: newV.meta.name,
    router: newV.fullPath,
    componentName: newV.name,
  })
  storeMutation.pushInRouterList({
    name: newV.meta.name,
    router: newV.fullPath,
    componentName: newV.name,
  })
})
watchEffect(() => {
  activeRouter.name = storeState.activeRouter.value.name
  activeRouter.router = storeState.activeRouter.value.router
  if (storeState.routerList.value.length != 0) {
    headerList.value = storeState.routerList.value
  }
})
</script>
<style lang="scss">
.router-header {
  .el-scrollbar__bar.is-horizontal {
    height: 3px !important;
  }
}
</style>
<style lang="scss" scoped>
.router-header {
  border: 1px solid #00cec9;
  border-radius: 5px;
  height: 35px;
  padding: 0 5px;
  margin: 10px 2px 5px 2px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .header-tag-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 35px;
    .header-tag {
      cursor: pointer;
      margin: 0 2px;
      height: 25px;
    }
  }
}
.menuList-container {
  width: 120px;
  padding: 5px;
  font-size: 12px;
  .menuList_item_start {
    // margin-top: 5px !important;
  }
  .menuList_item {
    margin: 0 5px 0 5px;
    border-bottom: 1px solid #dcdfe6;
    height: 20px;
    padding: 0 5px 5px 5px;
    line-height: 25px;
    cursor: pointer;
  }
  .menuList_item:hover {
    color: #ffffff;
    background-color: rgb(19, 15, 64);
    border-radius: 5px;
  }
  .menuList_item_end {
    margin-bottom: 0px;
    border: none;
  }
}
</style>
