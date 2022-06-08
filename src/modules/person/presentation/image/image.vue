<template>
    <div>
        这里是图片
    </div>
</template>
<script lang="ts">
export default {
    name: "PresentationImage"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
</style>