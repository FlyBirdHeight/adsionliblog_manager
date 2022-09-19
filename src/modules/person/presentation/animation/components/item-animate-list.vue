<template>
  <div class="item-animate_list" @drop="dragger.dragDrop($event)">
    <div
      :class="activeItem !== null && activeItem.index === item.itemIndex ? 'list-item-active list-item' : 'list-item'"
      draggable="true"
      @dragstart.native="dragger.dragStart($event, item)"
      @dragenter="dragger.dragEnter($event, item)"
      @dragover.prevent="dragger.dragOver($event, item)"
      @dragend="dragger.dragEnd($event)"
      @click="setAnimateSetting(index)"
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
import { ref, computed, watch, reactive, watchEffect, inject, defineEmits } from 'vue'
import useDrag from '../hooks/useDrag'
import useAnimateObj from '../hooks/useAnimateObj'
import useActiveItem from '../hooks/useActiveItem'
export default {
  name: 'ItemAnimateList',
}
</script>
<script lang="ts" setup>
const emits = defineEmits(['checkAnimateData'])
const animateObj = useAnimateObj()
const activeItem = useActiveItem()
const activeItemIndex = inject('activeItem')
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
const setAnimateSetting = function (index: number) {
  let item = showList.value[index];
  let attribute = item.action.options.attribute || ''
  let emitData = {
    task: item.mode,
    type: item.action.action,
    speed: item.action.speed,
    trigger: item.action.trigger,
    attribute,
  }
  if (activeItemIndex.value == -1) {
    activeItemIndex.value = item.itemIndex
  }
  emits('checkAnimateData', emitData)
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
    animateObj.changeAnimateOrder(oldIndex, index)
  }
})
</script>
<style lang="scss" scoped>
@import 'item-animate-list.scss';
</style>
