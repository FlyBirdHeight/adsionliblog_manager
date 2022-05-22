<template>
<h1>点击人数</h1>
</template>
<script lang="ts">
export default {
  name: "SiteSeeCount"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>