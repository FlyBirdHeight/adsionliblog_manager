<template>
  <div class="upload-image-header">
    <h1 class="header-title">图片上传</h1>
  </div>
  <upload-image-form />
  <current-image-show />
  <max-use-image />
</template>
<script lang="ts">
export default {
  name: 'UploadImage',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import UploadImageForm from '@/components/image/uploadImage/upload'
import CurrentImageShow from '@/components/image/uploadImage/current_image'
import MaxUseImage from '@/components/image/uploadImage/max_image'
const props = defineProps()
const emit = defineEmits([])
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
    font-weight: 900;
  }
}
</style>
