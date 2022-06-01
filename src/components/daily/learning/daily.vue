<template>
  <div class="day-learning-plan">
    <el-scrollbar height="85vh" always>
      <day-learning-setting-form @submitSuccess="submitSuccess" v-if="!planExist"></day-learning-setting-form>
      <day-learning-plan-show v-else></day-learning-plan-show>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, onMounted } from 'vue'
import { hasPlan } from '@/plugin/daily/learning/daily'
export default {
  name: 'DayLearningPlan',
}
</script>
<script lang="ts" setup>
import DayLearningSettingForm from '@/components/form/daily/learning/day_learning'
import DayLearningPlanShow from '@/components/daily/learning/daily/show'
const planExist = ref<boolean>(false)
onMounted(async () => {
  //   planExist.value = await hasPlan();
})

const submitSuccess = (val: any) => {
  console.log(val)
}
</script>
<style lang="scss">
.day-learning-plan {
  .el-scrollbar {
    height: auto !important;
  }
}
</style>
