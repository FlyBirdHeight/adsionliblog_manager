<template>
  <div class="presentation-text_textarea" @mousedown="mouseDownEvent" @dblclick.stop="setTextarea">
    <div
      class="show-presentation-text"
      ref="presentationShowText"
      v-show="!showArea"
      :style="textAreaCss"
      v-html="showText"
    ></div>
    <textarea
      ref="presentationTextarea"
      rows="1"
      v-show="showArea"
      :style="textAreaCss"
      v-model="props.info.data"
    ></textarea>
  </div>
  <div ref="calculateHeight" class="calculate-text-height" :style="textAreaCss" v-html="showText"></div>
</template>
<script lang="ts">
import { ref, defineProps, watch, computed, inject, nextTick } from 'vue'
import { analysisCss } from '@/modules/person/presentation/text/text'
export default {
  name: 'PresentationText',
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  info: any
}>()
const text = ref<string>('hello')
const presentationTextarea = ref()
const presentationShowText = ref()
const calculateHeight = ref()
const firstLineHeight = ref<boolean>(true)
const lineCount = ref<number>(1)
const lineHeight = ref<number>(0)
const showArea = ref<boolean>(false)
const showText = ref<string>('')
const activeItem = inject('activeItem')
const textAreaCss = computed(() => {
  if (props.info.style) {
    return analysisCss(props.info.style)
  } else {
    return null
  }
})
const mouseDownEvent = (event: any) => {
  if (showArea.value) {
    event.stopPropagation()
  }
}
const setTextarea = () => {
  showArea.value = true
  presentationTextarea.value.style.height = presentationShowText.value.clientHeight + 'px'
}
watch(
  () => props.info.data,
  (newV, oldV) => {
    nextTick(() => {
      if (firstLineHeight.value && presentationTextarea.value.getBoundingClientRect().height != 0) {
        lineHeight.value = presentationTextarea.value.getBoundingClientRect().height
        firstLineHeight.value = false
      }
      showText.value = newV.split('\n').join('<br />')
      nextTick(() => {
        if (presentationTextarea.value.scrollHeight > presentationTextarea.value.offsetHeight) {
          presentationTextarea.value.style.height = presentationTextarea.value.scrollHeight + 'px'
        } else {
          if (presentationTextarea.value.scrollHeight > calculateHeight.value.offsetHeight) {
            presentationTextarea.value.style.height = calculateHeight.value.offsetHeight + 'px'
          }
        }
        lineCount.value = Math.floor(presentationTextarea.value.scrollHeight / lineHeight.value)
      })
    })
  },
  {
    immediate: true,
  }
)
watch(activeItem, (newV, oldV) => {
  showArea.value = false
})
</script>
<style lang="scss" scoped>
.presentation-text_textarea {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  .show-presentation-text {
    width: 100%;
    height: auto;
    user-select: none;
    overflow-wrap: anywhere;
    font-family: monospace;
  }
  textarea {
    width: 100%;
    outline: none;
    overflow-y: hidden;
    resize: none;
    padding: 0;
  }
}
.calculate-text-height {
  visibility: hidden;
  width: calc(100% - 2px);
  height: auto;
  user-select: none;
  overflow-wrap: anywhere;
  font-family: monospace;
}
</style>
