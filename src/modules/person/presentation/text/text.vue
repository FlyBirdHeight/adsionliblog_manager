<template>
  <textarea
    ref="presentationTextarea"
    :style="textAreaCss"
    rows="1"
    class="presentation-text_textarea"
    v-model="props.info.data"
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
  info: any
}>()
const text = ref<string>('hello')
const presentationTextarea = ref()
const textAreaCss = computed(() => {
  if (props.info) {
    return analysisCss(props.info)
  } else {
    return null
  }
})
</script>
<style lang="scss" scoped>
.presentation-text_textarea {
  position: absolute;
  outline: none;
  overflow-y: hidden;
  resize: none;
  padding: 0;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
}
</style>
