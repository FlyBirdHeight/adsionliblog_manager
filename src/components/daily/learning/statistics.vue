<template>
  <div class="learning-statistics">学习内容统计</div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'LearningContentStatistics',
}
</script>
<script lang="ts" setup>
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
.learning-statistics {
    
}
</style>
