<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-${props.icon}`"></use>
  </svg>
</template>
<script lang="ts">
import { ref, defineProps } from 'vue'
export default {
  name: 'IconFont',
}
</script>
<script lang="ts" setup>

const props = defineProps<{
  icon: "redo"
}>()
</script>
<style lang="scss" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
