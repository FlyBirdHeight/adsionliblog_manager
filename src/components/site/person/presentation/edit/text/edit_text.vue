<template>
  <div class="edit-text">
    <div class="edit-text-font">
      <div class="text-font_header" @click.stop="hideStatus.fontSet = !hideStatus.fontSet">
        <span>文本设置：</span>
        <span style="float: right">
          <open-icon :change="hideStatus.fontSet" />
        </span>
      </div>
      <div class="text-font_body">
        <edit-font @changeFont="changeFont" />
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
const textStyle = ref(defaultStyle)
provide('fontStyle', textStyle.value.font)
const hideStatus = reactive({
  fontSet: true,
})
const changeFont = (val: any) => {
  let idx = itemList.text.findIndex((v) => v.index === activeIndex.value)
  textStyle.font = val
  itemList.text[idx].style.font = val
}
watch(
  activeIndex,
  (newV, oldV) => {
    if (newV !== -1) {
      if (itemList.text.length != 0) {
        let idx = itemList.text.findIndex((v) => v.index === newV)
        if (idx !== -1) {
          textStyle.value = itemList.text[idx].style
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
      cursor: pointer;
    }
    .text-font_body {
      width: 100%;
    }
  }
}
</style>
