<template>
  <div class="review-learning-plan">学习内容回顾</div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'ReviewLearningPlan',
}
</script>
<script lang="ts" setup>
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
.review-learning-plan {
}
</style>
