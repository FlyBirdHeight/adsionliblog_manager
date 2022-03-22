<template>
  <el-calendar ref="dailySetting">
    <template #header="{ date }">
      <span>Custom header content</span>
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
        <el-button size="small" @click="selectDate('today')">今天</el-button>
        <el-button size="small" @click="selectDate('next-month')">下个月</el-button>
      </el-button-group>
    </template>
    <template #dateCell="{ data }">
      <div :class="data.isSelected ? 'is-selected' : ''" @click="showDateInfo(data.day)">
        <div class="date_day">
          {{ data.day.substr(5) }}
        </div>
        <div
          v-if="dateMap.has(data.day) && dateMap.get(data.day).length != 0"
          style="display: flex; flex-wrap: wrap; overflow: hidden"
        >
          <div style="margin: 3px 5px" v-if="dateMap.get(data.day)[0].length != 0">
            <el-tooltip
              :content="`未确认进行日程数：${dateMap.get(data.day)[0].length}`"
              placement="right"
              effect="light"
            >
              <el-tag type="warning" effect="dark">
                {{ dateMap.get(data.day)[0][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div style="margin: 3px 5px" v-if="dateMap.get(data.day)[1].length != 0">
            <el-tooltip :content="`进行中日程数：${dateMap.get(data.day)[1].length}`" placement="right" effect="light">
              <el-tag effect="dark">
                {{ dateMap.get(data.day)[1][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div style="margin: 3px 5px" v-if="dateMap.get(data.day)[2].length != 0">
            <el-tooltip :content="`已超时日程数：${dateMap.get(data.day)[2].length}`" placement="right" effect="light">
              <el-tag type="danger" effect="dark">
                {{ dateMap.get(data.day)[2][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div style="margin: 3px 5px" v-if="dateMap.get(data.day)[3].length != 0">
            <el-tooltip :content="`已完成日程数：${dateMap.get(data.day)[3].length}`" placement="right" effect="light">
              <el-tag type="success" effect="dark">
                {{ dateMap.get(data.day)[3][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
        </div>
      </div>
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
const dateMap = ref(new Map())
const dailyDate = ref<DateSetting[]>([])
const dailySetting = ref()
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
})
const selectDate = (val: string) => {
  console.log(val);
  
  dailySetting.value.selectDate(val)
}
const showDateInfo = (day) => {
  const dataInfo = dateMap.value.get(day)
  console.log(dataInfo)
}
</script>
<style lang="scss">
.date_day {
  text-align: left;
  font-size: 12px;
  font-weight: bolder;
}
.el-calendar-table .el-calendar-day {
  height: 100%;
}
</style>
