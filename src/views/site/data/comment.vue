<template>
<h1>评论数据统计</h1>
</template>
<script lang="ts">
export default {
    name: "SiteComment"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>