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
      v-for="(item, index) in testData"
      :key="item.index"
    >
      <div class="item-index">{{ index + 1 }}</div>
      <div class="item-trigger">
        <el-icon><component :is="item.trigger == 'click' ? $icon['Mouse'] : $icon['VideoPlay']" /></el-icon>
      </div>
      <div class="item-animate">
        <icon-font class="edit-icon" :icon="'Hdonghua-xiangshangfeiru'" />
      </div>
      <div class="item-key">
        {{ item.index }}
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
export default {
  name: 'ItemAnimateList',
}
</script>
<script lang="ts" setup>
const handleObj = inject('handleObj')
const activeItem = inject('activeItem')
const animateObj = handleObj.implementAnimate
const testData = animateObj.showList

const activeIndex = function (index: string) {
  activeItem = index;
}

const dragger = useDrag(function (newV, oldV) {
  if (!newV || newV.index == this.dragInfo.index) {
    return
  } else {
    let index = testData.findIndex((v) => {
      return v.index == newV.index
    })
    let oldIndex = testData.findIndex((v) => {
      return v.index == this.dragInfo.index
    })
    let t = testData[oldIndex]
    testData[oldIndex] = testData[index]
    testData[index] = t
  }
})
</script>
<style lang="scss" scoped>
@import 'item-animate-list.scss';
</style>
