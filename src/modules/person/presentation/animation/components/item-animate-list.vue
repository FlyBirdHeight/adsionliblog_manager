<template>
  <div class="item-animate_list" @drop="dragDrop($event)">
    <div
      class="list-item"
      draggable="true"
      @dragstart.native="dragStart($event, item)"
      @dragenter="dragEnter($event, item)"
      @dragover.prevent="dragOver($event, item)"
      @dragend="dragEnd($event)"
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
export default {
  name: 'ItemAnimateList',
}
</script>
<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
const testData = ref([
  {
    trigger: 'click',
    animate: 'fly',
    index: '123456123456123456123456',
    mode: 'in',
  },
  {
    trigger: 'auto',
    animate: 'fly',
    index: '456789',
    mode: 'out',
  },
  {
    trigger: 'auto',
    animate: 'fly',
    index: '45612789',
    mode: 'out',
  },
  {
    trigger: 'auto',
    animate: 'fly',
    index: '456723289',
    mode: 'out',
  },
])
const activeIndex = function (index: string) {
  console.log(index)
}

const dragEnterData = ref(null)
const dragInfo = ref(null)
const dragDom = ref(null)

const dragStart = (event, column) => {
  dragInfo.value = column
  dragDom.value = event.path[0]
  dragDom.value.style.opacity = 0
}
const dragEnter = (event, column) => {
  dragEnterData.value = column
}
const dragOver = (event, column) => {
  event.preventDefault()
}
const dragEnd = (event) => {
  dragDom.value.style.opacity = 1
  dragDom.value = null
}
const dragDrop = (event) => {
  if (event.stopPropagation) {
    event.stopPropagation()
  }
  dragEnterData.value = null
  dragInfo.value = null
}
watch(dragEnterData, (newV, oldV) => {
  if (!newV || newV.index == dragInfo.value.index) {
    return
  } else {
    let index = testData.value.findIndex((v) => {
      return v.index == newV.index
    })
    let oldIndex = testData.value.findIndex((v) => {
      return v.index == dragInfo.value.index
    })
    let t = testData.value[oldIndex]
    testData.value[oldIndex] = testData.value[index]
    testData.value[index] = t
  }
})
</script>
<style lang="scss" scoped>
@import 'item-animate-list.scss';
</style>
