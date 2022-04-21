<template>
  <el-image-viewer
    @close="closeImagePreview"
    :infinite="true"
    v-if="showPreview"
    :url-list="previewList"
    :initial-index="previewIndex"
    :hide-on-click-modal="true"
    :teleported="true"
  ></el-image-viewer>
</template>
<script lang="ts">
export default {
  name: 'ImagePreview',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps({
  showPreview: {
    type: Boolean,
    default: false,
  },
  previewList: {
    type: Array,
    default: [],
  },
  previewIndex: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['closePreview'])

const closeImagePreview = () => {
  emit('closePreview', false, 'image_preview')
}
</script>
<style lang="scss" scoped></style>
