<template>
  <div class="upload-image-header">
    <h1 class="header-title">图片上传</h1>
  </div>
  <upload-image-form @currentImageUpdate="currentImageUpdate" />
  <current-image-show @setUpdateStatus="setUpdateStatus" />
  <max-use-image />
</template>
<script lang="ts">
export default {
  name: 'UploadImage',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, provide } from 'vue';
import UploadImageForm from '@/components/image/uploadImage/upload'
import CurrentImageShow from '@/components/image/uploadImage/current_image'
import MaxUseImage from '@/components/image/uploadImage/max_image'
const props = defineProps()
const emit = defineEmits(['currentImageUpdate'])
const updateCurrent = ref<boolean>(false)
provide('updateCurrent', updateCurrent)
const currentImageUpdate = (val: boolean = true) => {
  updateCurrent.value = val
}
const setUpdateStatus = (val: boolean = false) => {
  updateCurrent.value = val
}
</script>
<style lang="scss" scoped>
.upload-image-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: inherit;
    color: #606266;
  }
}
</style>
