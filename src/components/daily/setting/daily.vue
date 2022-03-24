<template>
  <el-calendar ref="dailySetting" class="calendar">
    <template #header="{ date }">
      <span>日程安排总览表</span>
      <span>{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
        <el-button size="small" @click="selectDate('today')">今天</el-button>
        <el-button size="small" @click="selectDate('next-month')">下个月</el-button>
      </el-button-group>
    </template>
    <template #dateCell="{ data }">
      <div :class="data.isSelected ? 'is-selected date-body' : 'date-body'" @click="showDateInfo(data.day)">
        <div class="date_day">
          {{ data.day.substr(5) }}
        </div>
        <div
          v-if="dateMap.has(data.day) && dateMap.get(data.day).length != 0"
          style="display: flex; flex-wrap: wrap; overflow: hidden"
        >
          <div class="date-body_info" v-if="dateMap.get(data.day)[0].length != 0">
            <el-tooltip
              :content="`未确认进行日程数：${dateMap.get(data.day)[0].length}`"
              placement="right"
              effect="light"
            >
              <el-tag class="date-body_info_tag" type="warning" effect="light">
                {{ dateMap.get(data.day)[0][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="date-body_info" v-if="dateMap.get(data.day)[1].length != 0">
            <el-tooltip :content="`进行中日程数：${dateMap.get(data.day)[1].length}`" placement="right" effect="light">
              <el-tag class="date-body_info_tag" effect="light">
                {{ dateMap.get(data.day)[1][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="date-body_info" v-if="dateMap.get(data.day)[2].length != 0">
            <el-tooltip :content="`已超时日程数：${dateMap.get(data.day)[2].length}`" placement="right" effect="light">
              <el-tag class="date-body_info_tag" type="danger" effect="light">
                {{ dateMap.get(data.day)[2][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
          <div class="date-body_info" v-if="dateMap.get(data.day)[3].length != 0">
            <el-tooltip :content="`已完成日程数：${dateMap.get(data.day)[3].length}`" placement="right" effect="light">
              <el-tag class="date-body_info_tag" type="success" effect="light">
                {{ dateMap.get(data.day)[3][0].target }}
              </el-tag>
            </el-tooltip>
          </div>
        </div>
        <div class="setting">
          <el-tooltip :content="'添加日程'" placement="top" effect="light">
            <el-button
              type="primary"
              class="setting_button"
              :icon="$icon['Edit']"
              @click="addDate(data.day)"
              size="small"
              circle
            />
          </el-tooltip>
          <el-tooltip :content="'查看详情'" placement="top" effect="light">
            <el-button
              type="success"
              class="setting_button"
              :icon="$icon['Reading']"
              @click="showInfo(data.day)"
              size="small"
              circle
            />
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-calendar>
  <daily-setting-info-dialog @closeDialog="closeDialog" />
  <daily-setting-form-dialog @closeDialog="closeFormDialog" />
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
import { ref, reactive, onMounted, watchEffect, provide } from 'vue'
import DailySettingInfoDialog from '@/components/dialog/daily/setting_info.vue'
import DailySettingFormDialog from '@/components/dialog/daily/setting_form.vue'
/**
 * @property {DateInfo} dateList 当前显示日期列表当前、下、上月的数据
 * @property {Map} dateMap 存放日程的表，按照每一天存放
 * @property {any} dailySetting 用来获取模板中ref标签
 * @property {Array} checkedDateInfo 鼠标点击时的日期的日程表数据
 */
const dateList = ref<DateInfo>()
const dateMap = ref(new Map())
const dailySetting = ref()
const checkedDateInfo = ref([])
/**
 * @description 这里的三个监听传递属性是给到查看日期详情的
 * @property {DateSetting[]} checkedDateInfoList 显示日程列表信息
 * @property {boolean} showInfoDialog 是否显示详情框
 * @property {boolean} showDailyFormDialog 是否显示日程添加框
 * @property {string} checkedDate 点击的日期，作为项情框和添加框的日期
 */
const checkedDateInfoList = ref<DateSetting[]>([])
const showInfoDialog = ref<boolean>(false)
const showDailyFormDialog = ref<boolean>(false)
const checkedDate = ref<string>('')
provide('dateTime', checkedDate)
provide('dateInfoData', checkedDateInfoList)
provide('dateInfoShow', showInfoDialog)
provide('dateSettingFormShow', showDailyFormDialog)
onMounted(() => {
  let date = new Date()
  getDateInfoList(date.getFullYear(), date.getMonth() + 1)
})
/**
 * @method selectDate 点击最上面的三个按钮时的回调方法，如果是上个月、下个月、今天都需要重新获取列表
 * @param {string} val 按钮类型
 */
const selectDate = (val: string) => {
  if (val == 'prev-month') {
    getDateInfoList(dateList.value.preYear, dateList.value.preMonth)
  } else if (val == 'next-month') {
    getDateInfoList(dateList.value.nextYear, dateList.value.nextMonth)
  } else {
    let date = new Date()
    if (
      date.getFullYear !== Number(dateList.value.currentYear) ||
      date.getMonth() + 1 !== Number(dateList.value.currentMonth)
    ) {
      getDateInfoList(date.getFullYear(), date.getMonth() + 1)
    }
  }
  dailySetting.value.selectDate(val)
}
/**
 * @method showDateInfo 点击日程框框时，显示相关信息以及日程如果切换了的话重新获取数据
 * @param {string} day 日期
 */
const showDateInfo = (day) => {
  const dataInfo = dateMap.value.get(day)
  let date = day.substr(0).split('-')
  if (Number(date[0]) != Number(dateList.value.currentYear) || Number(date[1]) != Number(dateList.value.currentMonth)) {
    getDateInfoList(Number(date[0]), Number(date[1]))
  }
}
/**
 * @method getDateInfoList 获取关于当前日期列表中的相关数据设置
 * @param {number} year 年份
 * @param {number} month 月份
 */
const getDateInfoList = (year: number, month: number) => {
  dateList.value = getMonth(year, month)
  dateMap.value.clear()
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
}
/**
 * @method addDate 添加日程
 * @param {string} day
 */
const addDate = (day: string) => {
  checkedDate.value = day
  showDailyFormDialog.value = true
}

const showInfo = (day: string) => {
  checkedDate.value = day
  let list = dateMap.value.get(day)
  let dateList = []
  for (let v of Reflect.ownKeys(list)) {
    if (v != 'length') {
      dateList = dateList.concat(list[v])
    }
  }
  checkedDateInfoList.value = dateList
  showInfoDialog.value = true
}
const closeDialog = (val: boolean) => {
  showInfoDialog.value = false
}
const closeFormDialog = (val: boolean) => {
  showDailyFormDialog.value = false
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
.el-tag__content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.calendar {
  .date-body {
    height: 100%;
    width: 100%;
    .date-body_info {
      margin: 3px 5px;
      width: 100%;
      .date-body_info_tag {
        width: 95%;
      }
    }
    .setting {
      width: 90%;
      margin: auto;
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      overflow: hidden;
      .setting_button {
        margin-left: 0px;
      }
    }
  }
}
</style>
