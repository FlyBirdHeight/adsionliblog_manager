<template>
  <div class="edit-body">
    <div class="edit-body-container">
      <div class="edit-container_header">
        <span>图片设置：</span>
      </div>
      <div class="edit-container_body">
        <edit-image />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, inject, provide } from 'vue'
import { imageInfo } from '@/modules/person/presentation/image/image'
export default {
  name: 'EditPresentationImage',
}
</script>
<script lang="ts" setup>
import EditImage from './image.vue'

const activeIndex = inject('activeItem')
const itemList = inject('itemList')
const itemObject = ref(null)
const imageData = ref(imageInfo())
provide('imageData', imageData)
const hideStatus = reactive({
  fontSet: true,
})
watch(
  activeIndex,
  (newV, oldV) => {
    if (newV !== -1) {
      if (itemList.image.length != 0) {
        let idx = itemList.image.findIndex((v) => v.index === newV)
        if (idx !== -1) {
          itemObject.value = itemList.image[idx]
          imageData.value = itemObject.value
        }
      }
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped></style>
