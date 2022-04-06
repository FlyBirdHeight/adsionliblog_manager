<template>
  <div class="current-image-list"></div>
</template>
<script lang="ts">
export default {
  name: 'CurrentImageShow',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
.current-image-list {
  display: flex;
  width: 100%;
  height: 400px;
  @media screen and(min-width: 500px) {
      height: 300px;
  }
  border: 1px solid #ebeef5;
}
</style>
