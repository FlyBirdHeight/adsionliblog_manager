<template>
  <el-calendar>
    <template #dateCell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        <!-- {{data}} -->
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </el-calendar>
</template>
<script lang="ts" setup>
import {
  DateSetting,
  DateType,
  getMonth,
  DateInfo,
  getWholeDaily,
  handleDailyData,
  generateDataList,
} from '@/plugin/daily/setting'
import { ref, reactive, onMounted } from 'vue'

const dateList = ref<DateInfo>()
const dateMap = ref(null)
onMounted(() => {
  dateList.value = getMonth()
  dateMap.value = generateDataList(Number(dateList.value.currentYear), Number(dateList.value.currentMonth))
  getWholeDaily(dateList.value)
    .then((res) => {
      handleDailyData(
        res,
        dateMap.value,
        [dateList.value.preYear, dateList.value.preMonth],
        [dateList.value.nextYear, dateList.value.nextMonth]
      )
    })
    .catch((e) => {
      console.log(e)
    })

  console.log(dateMap)
})

const dailyDate = ref<DateSetting[]>([])
</script>
<style lang="scss"></style>
