<template>
  <el-icon
    ><component
      :style="{
        transition: 'all 0.4s linear',
        transform: props.change ? 'rotate(0deg)' : 'rotate(90deg)',
      }"
      :is="$icon['CaretBottom']"
  /></el-icon>
</template>
<script lang="ts">
import { defineProps } from 'vue'
export default {
  name: 'OpenIcon',
}
</script>
<script lang="ts" setup>
const props = defineProps({
  change: {
    type: Boolean,
    default: false,
  },
})
</script>
<style lang="scss" scoped></style>
