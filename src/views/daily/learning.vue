<template>
<h1>学习计划制定</h1>
</template>
<script lang="ts">
export default {
    name: "DailyLearning"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>