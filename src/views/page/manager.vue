<template>
<h1>文章管理</h1>
</template>
<script lang="ts">
export default {
    name: "PageManager"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>