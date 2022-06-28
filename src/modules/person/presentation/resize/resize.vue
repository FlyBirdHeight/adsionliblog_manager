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
        @mousedown.stop="handleScale('tl', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(2) }"
        class="resize-point top-center"
        @mousedown.stop="handleScale('tm', $event)"
      ></div>

      <div
        :style="{ cursor: getCursor(3) }"
        class="resize-point right-top"
        @mousedown.stop="handleScale('tr', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(4) }"
        class="resize-point right-center"
        @mousedown.stop="handleScale('mr', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(5) }"
        class="resize-point right-bottom"
        @mousedown.stop="handleScale('br', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(6) }"
        class="resize-point bottom-center"
        @mousedown.stop="handleScale('bm', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(8) }"
        class="resize-point left-center"
        @mousedown.stop="handleScale('ml', $event)"
      ></div>
      <div
        :style="{ cursor: getCursor(7) }"
        class="resize-point left-bottom"
        @mousedown.stop="handleScale('bl', $event)"
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
import { scale } from './utils/scale'
export default {
  name: 'ResizeElement',
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
const emit = defineEmits(['changeStatus'])
const childPropsData = ref()
const handleObj = inject('handleObj')
const domStyle = reactive({
  element: {},
  controls: {},
})
onMounted(() => {
  child.value = slots.default?.()[0]
  setResizeStyle(child, childType, resizeData, resizeElement.value.parentElement.getBoundingClientRect())
  activeIndex.value = child.value.props.info.index
  childPropsData.value = child.value.props.info
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
  onDrag(resizeElement.value, drag, (timestamp) => {
    emit('changeStatus', timestamp)
    // handleObj.updateItem()
    childPropsData.value.style.position = { x: resizeData.offset.x, y: resizeData.offset.y }
  })
}
const handleScale = (activeType: string, event: Event) => {
  event.stopPropagation()
  let scaleData = Object.assign({}, resizeData.attribute)
  scaleData = Object.assign(scaleData, resizeData.offset)
  scaleData = Object.assign(scaleData, { scaleX: resizeData.scale.x, scaleY: resizeData.scale.y })
  scaleData = Object.assign(scaleData, { startX: event.pageX, startY: event.pageY })
  scaleData = Object.assign(scaleData, resizeData.event)

  const scaleDom = scale(scaleData, activeType, 0.1, (currentData) => {
    resizeData.offset = { x: currentData.x, y: currentData.y }
    resizeData.scale.x = currentData.scaleX
    resizeData.scale.y = currentData.scaleY
  })
  onDrag(resizeElement.value.parentElement, scaleDom, (timestamp) => {
    emit('changeStatus', timestamp)
    childPropsData.value.style.position = { x: resizeData.offset.x, y: resizeData.offset.y }
    childPropsData.value.style.scale = { x: resizeData.scale.x, y: resizeData.scale.y }
  })
}

const handleRotate = (event) => {
  const rotateDom = rotate(
    resizeData.offset,
    resizeData.scale,
    resizeData.attribute,
    { x: event.pageX, y: event.pageY },
    resizeData.containerOffset,
    (data) => {
      resizeData.attribute.angle = data.angle
    }
  )

  onDrag(resizeElement.value.parentElement, rotateDom, (timestamp) => {
    emit('changeStatus', timestamp)
    childPropsData.value.style.attribute.angle = resizeData.attribute.angle
  })
}
const updateResizeData = (style: any) => {
  resizeData.attribute = {
    width: style.attribute.width,
    height: style.attribute.height,
    angle: style.attribute.angle,
  }
  resizeData.scale = { x: style.scale.x, y: style.scale.y }
}
watch(
  childPropsData,
  (newV, oldV) => {
    updateResizeData(newV.style)
  },
  {
    deep: true,
  }
)
const getCursor = (type: string) => {
  return getCursorType(resizeData.attribute.angle, type)
}
</script>
<style lang="scss" scoped>
@import './resize.scss';
</style>
