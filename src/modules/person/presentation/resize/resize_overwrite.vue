<template>
  <div
    class="resize-element"
    ref="resizeElement"
    id="dragResizeElement"
    @mouseenter.stop="dragMouseEnter"
    @mouseleave.stop="dragMouseLeave"
    @click.stop="emit('emitActive', activeIndex)"
    @mousedown="activeItem = activeIndex"
    v-dragResize
  >
    <div class="content">
      <slot></slot>
    </div>
    <div
      class="control"
      :class="activeItem === activeIndex ? '' : 'resize-element-border'"
      v-show="activeItem === activeIndex"
    >
      <div
        :style="{ cursor: getCursor(1) }"
        class="resize-point left-top"
        @mousedown.stop="handleDown(1, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(2) }"
        class="resize-point top-center"
        @mousedown.stop="handleDown(2, $event)"
      ></div>

      <div
        :style="{ cursor: getCursor(3) }"
        class="resize-point right-top"
        @mousedown.stop="handleDown(3, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(4) }"
        class="resize-point right-center"
        @mousedown.stop="handleDown(4, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(5) }"
        class="resize-point right-bottom"
        @mousedown.stop="handleDown(5, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(6) }"
        class="resize-point bottom-center"
        @mousedown.stop="handleDown(6, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(8) }"
        class="resize-point left-center"
        @mousedown.stop="handleDown(8, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(7) }"
        class="resize-point left-bottom"
        @mousedown.stop="handleDown(7, $event)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'ResizeOverwrite',
}
</script>
<script lang="ts" setup>
const handleDown = (activeType: number, event: any) => {}
</script>
<style lang="scss" scoped></style>
