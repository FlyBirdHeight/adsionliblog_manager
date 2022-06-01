<template>
  <div class="learning-edit">
    <h2 class="header-title">学习计划</h2>
    <el-button-group>
      <el-button :type="showType == 1 ? 'primary' : ''" @click="showType = 1">今日学习</el-button>
      <el-button :type="showType == 2 ? 'primary' : ''" @click="showType = 2">知识回顾</el-button>
      <el-button :type="showType == 3 ? 'primary' : ''" @click="showType = 3">学习统计</el-button>
    </el-button-group>
  </div>
  <day-learning-plan v-if="showType === 1"></day-learning-plan>
  <review-learning-plan v-else-if="showType === 2"></review-learning-plan>
  <learning-content-statistics v-else></learning-content-statistics>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'DailyLearning',
}
</script>
<script lang="ts" setup>
import DayLearningPlan from '@/components/daily/learning/daily'
import ReviewLearningPlan from '@/components/daily/learning/review'
import LearningContentStatistics from '@/components/daily/learning/statistics'
const showType = ref<number>(1)
</script>
<style lang="scss" scoped>
.learning-edit {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: inherit;
  }
}
</style>
