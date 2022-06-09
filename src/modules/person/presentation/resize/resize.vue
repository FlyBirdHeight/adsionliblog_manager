<template>
  <div class="resize-element" ref="resizeElement">
    <div class="resize-point top-center" id="top-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-top" id="left-top" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-center" id="left-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-bottom" id="left-bottom" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-top" id="right-top" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-center" id="right-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-bottom" id="right-bottom" @mousedown.stop="handleDown"></div>
    <div class="resize-point bottom-center" id="bottom-center" @mousedown.stop="handleDown"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { ref, useSlots, defineProps, getCurrentInstance, reactive } from 'vue'
import { calculateChangeWidthAndHeight, changeLocation } from './resize.ts'
export default {
  name: 'ResizeElement',
}
</script>
<script lang="ts" setup>
const props = defineProps({
  parent: {
    type: String,
    default: 'body',
  },
})
const slots = useSlots()
const parentDom = ref(null)
const resizeElement = ref()
const position = reactive({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  type: '',
})
const mouseMoveListener = (event) => {
  let { x, y, width, height } = resizeElement.value.getBoundingClientRect()
  let { nH, nW } = calculateChangeWidthAndHeight(event.x, event.y, position.left, position.top, width, height, position.type)
  if (nH !== 0) {
    resizeElement.value.style.height = nH + 'px'
  }
  if (nW !== 0) {
    resizeElement.value.style.width = nW + 'px'
  }
}
const mouseUpListener = (event) => {
  parentDom.value.removeEventListener('mousemove', mouseMoveListener)
  parentDom.value.removeEventListener('mouseup', mouseUpListener)
}
const mouseLeaveListener = (event) => {
  parentDom.value.removeEventListener('mousemove', mouseMoveListener)
  parentDom.value.removeEventListener('mouseup', mouseUpListener)
  parentDom.value.removeEventListener('mouseleave', mouseLeaveListener)
}
const handleDown = (event: any) => {
  for (let v of event.path) {
    if (v.id === props.parent) {
      parentDom.value = v
      break
    }
  }
  parentDom.value.addEventListener('mousemove', mouseMoveListener)
  parentDom.value.addEventListener('mouseup', mouseUpListener)
  parentDom.value.addEventListener('mouseleave', mouseLeaveListener)
  console.log(event);
  

  changeLocation(event.path[0].id, resizeElement, parentDom, position)
}
</script>
<style lang="scss" scoped>
.resize-element {
  position: absolute;
  left: 30%;
  top: 30%;
  width: 200px;
  height: 100px;
  border: 1px dashed rgba(0, 0, 0, 0.6);
  padding: 5px;
  .resize-point {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #409eff;
    z-index: 999;
  }
  .right-top {
    cursor: ne-resize;
    top: -5px;
    right: -5px;
  }
  .right-center {
    top: calc(50% - 5px);
    right: -5px;
    cursor: e-resize;
  }
  .right-bottom {
    top: calc(100% - 5px);
    right: -5px;
    cursor: se-resize;
  }
  .left-top {
    cursor: nw-resize;
    top: -5px;
    left: -5px;
  }
  .left-center {
    cursor: w-resize;
    top: calc(50% - 5px);
    left: -5px;
  }
  .left-bottom {
    cursor: sw-resize;
    top: calc(100% - 5px);
    left: -5px;
  }
  .bottom-center {
    bottom: -5px;
    left: calc(50% - 5px);
    cursor: s-resize;
  }
  .top-center {
    top: -5px;
    left: calc(50% - 5px);
    cursor: n-resize;
  }
}
</style>
