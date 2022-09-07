<template>
  <h1>动画时间轴设置测试</h1>
  <el-button-group>
    <el-button @click="handle('start')"> 开始 </el-button>
    <el-button @click="handle('parse')"> 暂停 </el-button>
    <el-button @click="handle('click')"> 点击触发 </el-button>
    <el-button @click="handle('forward')"> 快进 </el-button>
    <el-button @click="handle('end')"> 直接完成 </el-button>
    <el-button @click="handle('restart')">重置</el-button>
  </el-button-group>
</template>
<script lang="ts">
import { pageAnimate, itemAnimate, execuateStack } from './data/animate_test'
import ImplementAnimate from '@/modules/person/presentation/animation/implement.ts'
export default {
  name: 'AnimateTest',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
const animateStack = new ImplementAnimate()
const setList = () => {
  for (let value of itemAnimate) {
    if (value.trigger === 'auto') {
      animateStack.autoImplementStack.set(value.itemIndex + '-' + value.mode, value)
    } else {
      animateStack.activeTrigger.set(value.itemIndex + '-' + value.mode, value)
    }
  }
}
setList()
animateStack.pageAnimate = pageAnimate
animateStack.execuationOrder = (() => {
  let map = new Map()
  for (let value of execuateStack) {
    map.set(value.order, value)
  }
  return map
})()
const handle = function (action: string) {
  switch (action) {
    case 'start':
      animateStack.runTask()
      break
    case 'parse':
      animateStack.pauseTask()
      break
    case 'click':
      animateStack.triggerClick()
      break
    case 'forward':
      animateStack.quickRunning()
      break
    case 'end':
      animateStack.executeNow();
      break
    case 'restart':
      animateStack.restartTask();
    default:
      break
  }
}
</script>
<style lang="scss" scoped></style>
