<template>
  <img draggable="false" :src="props.info.url" :style="imageCss" />
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { analysisCss } from './image'
export default {
  name: 'PresentationImage',
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  info: any
}>()

const emit = defineEmits([])
const imageCss = computed(() => {
  if (props.info.style) {
    let css = analysisCss(props.info.style, props.info.url)

    return css
  } else {
    return null
  }
})
</script>
<style lang="scss" scoped></style>
