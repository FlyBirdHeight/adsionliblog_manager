<template>
  <div class="resize-element">
    <div class="resize-point top-center" id="top-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-top" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point left-bottom" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-top" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-center" @mousedown.stop="handleDown"></div>
    <div class="resize-point right-bottom" @mousedown.stop="handleDown"></div>
    <div class="resize-point bottom-center" @mousedown.stop="handleDown"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { ref, useSlots } from 'vue'
export default {
  name: 'ResizeElement',
}
</script>
<script lang="ts" setup>
const slots = useSlots()
const click = () => {
  console.log(123)
}
const handleDown = (event: any) => {
  console.log(event.path[0].id)
}
</script>
<style lang="scss" scoped>
.resize-element {
  position: fixed;

  left: 45%;
  border: 1px dashed rgba(0, 0, 0, 0.6);
  width: 200px;
  height: 200px;
  margin: 20px auto;
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
