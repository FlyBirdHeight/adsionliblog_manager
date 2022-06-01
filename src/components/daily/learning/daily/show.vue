<template>
  <div class="day-learning-plan-show">show</div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'DayLearningPlanShow',
}
</script>
<script lang="ts" setup>
const props = defineProps()
const emit = defineEmits([])
</script>
<style lang="scss" scoped>
.day-learning-plan-show {
}
</style>
