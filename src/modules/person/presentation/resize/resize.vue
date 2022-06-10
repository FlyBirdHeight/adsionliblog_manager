<template>
  <div
    class="resize-element"
    ref="resizeElement"
    id="dragResizeElement"
    :class="activeItem === activeIndex ? '' : 'resize-element-border'"
    @mouseenter.stop="dragMouseEnter"
    @mouseleave.stop="dragMouseLeave"
    @click.stop="emit('emitActive', activeIndex)"
    v-dragResize
  >
    <div
      v-show="activeItem === activeIndex"
      class="resize-point top-center"
      id="top-center"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point left-top"
      id="left-top"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point left-center"
      id="left-center"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point left-bottom"
      id="left-bottom"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point right-top"
      id="right-top"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point right-center"
      id="right-center"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point right-bottom"
      id="right-bottom"
      @mousedown.stop="handleDown"
    ></div>
    <div
      v-show="activeItem === activeIndex"
      class="resize-point bottom-center"
      id="bottom-center"
      @mousedown.stop="handleDown"
    ></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { ref, useSlots, defineProps, reactive, onMounted, getCurrentInstance, inject, defineEmits } from 'vue'
import { calculateChangeWidthAndHeight, changeLocation } from './resize'
export default {
  name: 'ResizeElement',
  directives: {
    //数据检索位置拖动
    dragResize(el: any, bindings: any) {
      el.onmousedown = function (e: any) {
        let box: any = this
        if (e.path[0].id !== 'dragResizeElement') {
          return
        }
        let disX: any = e.clientX - box.offsetLeft
        let disY: any = e.clientY - box.offsetTop
        document.onmousemove = function (e) {
          box.style.left = e.pageX - disX + 'px'
          box.style.top = e.pageY - disY + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
      }
    },
  },
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
const child = ref(null)
const childDom = ref(null)
const activeIndex = ref<number>(0)
const activeItem = inject('activeItem')
const emit = defineEmits(['emitActive', 'changeStatus'])
onMounted(() => {
  child.value = slots.default?.()[0]
  let { width, height } = child.value?.props?.info.layout
  resizeElement.value.style.width = width
  resizeElement.value.style.height = height
  let length = resizeElement.value.__vnode.children.length
  childDom.value = resizeElement.value.__vnode.children[length - 1].children[0]
  activeIndex.value = childDom.value.props.info.index
})
const parentDom = ref<any>(null)
const resizeElement = ref<any>()
//NOTE: 专门用来处理拖拽改变位置的内容
const dragMouseEnter = (event: any) => {
  resizeElement.value.style.cursor = 'move'
}
const dragMouseLeave = (event: any) => {
  resizeElement.value.style.cursor = 'auto'
}

//NOTE: 专门用来处理修改大小的内容
const position = reactive({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  type: '',
})
const mouseMoveListener = (event: any) => {
  let { width, height } = resizeElement.value.getBoundingClientRect()
  let { nH, nW } = calculateChangeWidthAndHeight(
    event.x,
    event.y,
    position.left,
    position.top,
    width,
    height,
    position.type
  )
  if (nH !== 0) {
    resizeElement.value.style.height = nH + 'px'
    child.value.props.info.layout.lineHeight = nH + 'px'
  }
  if (nW !== 0) {
    resizeElement.value.style.width = nW + 'px'
  }
}
const mouseUpListener = (event: any) => {
  event.stopPropagation()
  parentDom.value.removeEventListener('mousemove', mouseMoveListener)
  parentDom.value.removeEventListener('mouseup', mouseUpListener)
  emit('changeStatus', event.timeStamp)
}
const mouseLeaveListener = (event: any) => {
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
  changeLocation(event.path[0].id, resizeElement, parentDom, position)
}
</script>
<style lang="scss" scoped>
.resize-element {
  position: absolute;
  left: 30%;
  top: 30%;
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
.resize-element-border {
  border: none;
}
</style>
