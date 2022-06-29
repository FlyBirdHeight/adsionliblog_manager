<template>
  <div class="edit-text">
    <div class="edit-text-font">
      <div class="text-font_header" @click.stop="hideStatus.fontSet = !hideStatus.fontSet">
        <span>文本设置：</span>
      </div>
      <div class="text-font_body">
        <edit-font />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, inject, watch, reactive, provide } from 'vue'
import { defaultStyle } from '@/modules/person/presentation/text/text'
export default {
  name: 'EditPresentationText',
}
</script>
<script lang="ts" setup>
import EditFont from './font.vue'
const activeIndex = inject('activeItem')
const itemList = inject('itemList')
const itemObject = ref(null)
const textData = ref(defaultStyle())
provide('textData', textData)
const hideStatus = reactive({
  fontSet: true,
})
watch(
  activeIndex,
  (newV, oldV) => {
    if (newV !== -1) {
      if (itemList.value.item.text.length != 0) {
        let idx = itemList.value.item.text.findIndex((v) => v.index === newV)
        if (idx !== -1) {
          itemObject.value = itemList.value.item.text[idx]
          textData.value = itemObject.value
        }
      }
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
.edit-text {
  width: 100%;
  margin-top: 10px;
  .edit-text-font {
    padding: 3px;
    border: 1px solid #e4e7ed;
    border-radius: 5px;
    .text-font_header {
      @include header();
      line-height: 35px;
    }
    .text-font_body {
      width: 100%;
    }
  }
}
</style>
