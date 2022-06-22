<template>
  <div
    class="resize-element"
    ref="resizeElement"
    @mouseenter.stop="dragMouseEnter"
    @mouseleave.stop="dragMouseLeave"
    @click.stop="activeItem = activeIndex"
    @mousedown.stop="handleDrag"
  >
    <div class="content" :style="domStyle.element">
      <slot></slot>
    </div>
    <div
      class="control"
      :class="activeItem === activeIndex ? '' : 'resize-element-border'"
      :style="domStyle.controls"
      v-show="activeItem === activeIndex"
    >
      <div class="rotate-button" @mousedown.stop="handleRotate($event)" />
      <div
        :style="{ cursor: getCursor(1) }"
        class="resize-point left-top"
        @mousedown.stop="handleSclae(1, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(2) }"
        class="resize-point top-center"
        @mousedown.stop="handleSclae(2, $event)"
      ></div>

      <div
        :style="{ cursor: getCursor(3) }"
        class="resize-point right-top"
        @mousedown.stop="handleSclae(3, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(4) }"
        class="resize-point right-center"
        @mousedown.stop="handleSclae(4, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(5) }"
        class="resize-point right-bottom"
        @mousedown.stop="handleSclae(5, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(6) }"
        class="resize-point bottom-center"
        @mousedown.stop="handleSclae(6, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(8) }"
        class="resize-point left-center"
        @mousedown.stop="handleSclae(8, $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(7) }"
        class="resize-point left-bottom"
        @mousedown.stop="handleSclae(7, $event)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, defineEmits, computed, watch, reactive, inject, useSlots } from 'vue'
import { setResizeStyle, getCursorType, generateData } from './utils/init'
import { onDrag, dragDom } from './utils/drag'
import styler from './utils/style'
import { rotate } from './utils/rotate'
export default {
  name: 'ResizeOverwrite',
}
</script>
<script lang="ts" setup>
const slots = useSlots()
const child = ref(null)
const childType = ref<string>('text')
const activeIndex = ref<number>(0)
const activeItem = inject('activeItem')
const parentDom = ref<any>(null)
const resizeElement = ref<any>()
const resizeData = reactive(generateData())
const domStyle = reactive({
  element: {},
  controls: {},
})
onMounted(() => {
  child.value = slots.default?.()[0]
  setResizeStyle(child, childType, resizeData, resizeElement.value.parentElement.getBoundingClientRect())
  activeIndex.value = child.value.props.info.index
})
watch(
  resizeData,
  (newV, oldV) => {
    const { element, controls } = styler(newV.offset, newV.attribute, newV.scale, newV.layer, newV.disableScale)
    domStyle.element = {
      ...element,
      width: element.width ? `${element.width}px` : null,
      height: element.height ? `${element.height}px` : null,
    }
    domStyle.controls = {
      ...controls,
      width: `${controls.width}px`,
      height: `${controls.height}px`,
    }
  },
  {
    deep: true,
  }
)

const handleDrag = (event) => {
  if (activeItem.value !== activeIndex.value) {
    activeItem.value = activeIndex.value
  }
  const drag = dragDom(resizeData.offset, { x: event.pageX, y: event.pageY })
  onDrag(resizeElement.value, drag)
}
const handleSclae = (activeType: number, event: Event) => {
  console.log(activeType)
  console.log(event)
}

const handleRotate = (event) => {
  const rotateDom = rotate(
    resizeData.offset,
    resizeData.scale,
    resizeData.attribute,
    { x: event.pageX, y: event.pageY },
    resizeData.containerOffset,
    (data) => {
      resizeData.attribute.angle = data.angel
    }
  )

  onDrag(resizeElement.value.parentElement, rotateDom)
}
//NOTE: 专门用来处理拖拽改变位置的内容
const dragMouseEnter = (event: any) => {
  resizeElement.value.style.cursor = 'move'
}
const dragMouseLeave = (event: any) => {
  resizeElement.value.style.cursor = 'auto'
}
const getCursor = (type: string) => {
  return getCursorType(resizeData.attribute.angle, type)
}
</script>
<style lang="scss" scoped>
.resize-element {
  position: absolute;
  .content {
    user-select: none;
    padding: 5px;
  }
  .control {
    padding: 5px;
    border: 1px dashed rgba(0, 0, 0, 0.6);
    .resize-point {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #409eff;
      z-index: 999;
    }
    .rotate-button {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #409eff;
      top: -45px;
      left: calc(50% - 6px);
      z-index: 999;
      cursor: grabbing;
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
}
.resize-element-border {
  border: none;
}
</style>
