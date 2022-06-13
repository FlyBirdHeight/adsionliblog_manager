<template>
  <transition name="expand_collapse">
    <slot></slot>
  </transition>
</template>
<script lang="ts">
export default {
  name: 'ExpandCollapse',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>
