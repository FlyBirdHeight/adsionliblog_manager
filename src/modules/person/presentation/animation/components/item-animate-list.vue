<template>
  <div class="item-animate_list" @drop="dragger.dragDrop($event)">
    <div
      class="list-item"
      draggable="true"
      @dragstart.native="dragger.dragStart($event, item)"
      @dragenter="dragger.dragEnter($event, item)"
      @dragover.prevent="dragger.dragOver($event, item)"
      @dragend="dragger.dragEnd($event)"
      @click="activeIndex(item)"
      v-for="(item, index) in showList"
      :key="item.itemIndex + '-' + item.mode"
    >
      <div class="item-index">{{ index + 1 }}</div>
      <div class="item-trigger">
        <el-icon><component :is="item.action.trigger == 'click' ? $icon['Mouse'] : $icon['VideoPlay']" /></el-icon>
      </div>
      <!-- <div class="item-animate">
        <icon-font class="edit-icon" :icon="item.icon" />
      </div> -->
      <div class="item-key">
        {{ item.itemIndex }}
      </div>
      <div class="item-mode">
        <el-tag v-if="item.mode === 'in'">进入</el-tag>
        <el-tag type="warning" v-if="item.mode === 'out'">退出</el-tag>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, inject } from 'vue'
import useDrag from '../hooks/useDrag'
import useAnimateObj from '../hooks/useAnimateObj'
export default {
  name: 'ItemAnimateList',
}
</script>
<script lang="ts" setup>
const animateObj = useAnimateObj()
const activeItem = inject('activeItem')
const showList = ref(animateObj.showList)

watch(
  () => animateObj.showList,
  (newV, oldV) => {
    showList.value = newV
  },
  {
    deep: true,
  }
)
const activeIndex = function (index: string) {
  activeItem = index
}

const dragger = useDrag(function (newV, oldV) {
  if (!newV || (newV.itemIndex == this.dragInfo.itemIndex && newV.mode == this.dragInfo.mode)) {
    return
  } else {
    let index = showList.value.findIndex((v) => {
      return v.itemIndex == newV.itemIndex && v.mode == newV.mode
    })
    let oldIndex = showList.value.findIndex((v) => {
      return v.itemIndex == this.dragInfo.itemIndex && v.mode == this.dragInfo.mode
    })
    let t = showList.value[oldIndex]
    showList.value[oldIndex] = showList.value[index]
    showList.value[index] = t
  }
})
</script>
<style lang="scss" scoped>
@import 'item-animate-list.scss';
</style>
