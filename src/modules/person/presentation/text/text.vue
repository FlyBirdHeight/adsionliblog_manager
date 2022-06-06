<template>
  <div class="presentation-text">
    <textarea ref="presentationTextarea" rows="1" class="presentation-text_textarea" v-model="text"></textarea>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PresentationText',
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
const text = ref<string>('')
const presentationTextarea = ref()
watch(text, (newV, oldV) => {
  presentationTextarea.value.$el.style.height = presentationTextarea.value.$el.scrollHeight + 'px'
})
</script>
<style lang="scss" scoped>
.presentation-text {
  position: absolute;
  top: 20%;
  left: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  .text_textarea {
    line-height: 40px;
    font-size: 14px;
    margin: left;
  }
}
</style>
