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
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'EditPresentationImage',
}
</script>
<script lang="ts" setup>
import EditImage from './image.vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped></style>
