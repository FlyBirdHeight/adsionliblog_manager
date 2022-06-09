<template>
  <textarea
    ref="presentationTextarea"
    :style="textAreaCss"
    rows="1"
    class="presentation-text_textarea"
    v-model="text"
  ></textarea>
</template>
<script lang="ts">
import { ref, defineProps, watch, computed } from 'vue'
import { analysisCss } from '@/modules/person/presentation/text/text'
export default {
  name: 'PresentationText',
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  textInfo: any
}>()
const text = ref<string>('hello')
const presentationTextarea = ref()
const textAreaCss = computed(() => {
  if (props.textInfo) {
    return analysisCss(props.textInfo)
  }
  return {
    width: '100px',
    height: '50px',
    left: '50%',
    top: '50%',
  }
})
watch(text, (newV, oldV) => {
  if (presentationTextarea.value.getBoundingClientRect().height < presentationTextarea.value.scrollHeight) {
    textAreaCss.value.height = presentationTextarea.value.scrollHeight + 'px'
    console.log(presentationTextarea.value.style.height)
  }
})
</script>
<style lang="scss" scoped>
.presentation-text_textarea {
  position: absolute;
  outline: none;
  overflow-y: visible;
  resize: none;
  padding: 0;
}
</style>
