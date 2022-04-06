<template>
<h1>最多被使用图片(图片墙，展示16张，一行8张，当然这个视屏幕大小决定，给一个flex)</h1>
</template>
<script lang="ts">
export default {
    name: "MaxUseImage"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>