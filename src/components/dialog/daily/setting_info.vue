<template>
  <dialog-show :title="title" :width="'50%'" :show="show" @closeDialog="closeDialog">
    <template #mainBody>
      <div class="setting-info-table">
        <el-table :row-class-name="tableRowClassName" border :data="dateList" height="500" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <daily-setting-info :data="props.row"></daily-setting-info>
            </template>
          </el-table-column>
          <el-table-column width="60" label="编号" type="index" :index="indexMethod" />
          <el-table-column label="创建人" prop="creator" />
          <el-table-column
            label="日程内容"
            width="180"
            style="overflow: hidden; text-overflow: ellipsis"
            prop="target"
          />
          <el-table-column label="开始时间" prop="start_time" />
          <el-table-column label="结束时间" prop="end_time" />
        </el-table>
      </div>
    </template>
    <template #foot>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'DailySettingInfoDialog',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, inject } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
import DailySettingInfo from '@/components/utils/card/daily_setting_info.vue'
import { DateSetting } from '@/plugin/daily/setting'

const props = defineProps()
const emit = defineEmits(['closeDialog'])
/**
 * @property {[]} dateList 日程数据,由父组件传递下来
 * @property {string} dateTime 当前日期，由父组件传递下来
 * @property {boolean} show 是否显示dialog框，也是由父组件传递过来
 * @property {string} title dialog的标题，由父组件传递下来的数据决定
 */
const dateList = inject('dateInfoData')
const dateTime = inject('dateTime')
const show = inject('dateInfoShow')
const title = computed(() => {
  return `${dateTime.value}的日程安排`
})
/**
 * @method closeDialog 关闭dialog显示的回调，也可以用于主动关闭
 * @param {boolean} val
 */
const closeDialog = (val: boolean = false) => {
  emit('closeDialog', val)
}
/**
 * @method tableRowClassName 根据日程的状态不同，给予不同的行颜色
 * @param {Object.row} row 行数据
 * @param {Object.rowIndex} rowIndex 行数据下标
 */
const tableRowClassName = ({ row, rowIndex }: { DateSetting; number }): string => {
  let returnClass = ''
  switch (row.status) {
    case 0:
      returnClass = 'warning-row'
      break
    case 1:
      returnClass = 'primary-row'
      break
    case 2:
      returnClass = 'danger-row'
      break
    case 3:
      returnClass = 'success-row'
      break
    default:
      break
  }
  return returnClass
}
const indexMethod = (index: number) => {
  return index + 1
}
</script>
<style lang="scss">
.el-table .warning-row {
  --el-table-tr-bg-color: rgba(218, 111, 0, 0.7);
  font-weight: 600;
  color: #fff;
}
.el-table .primary-row {
  --el-table-tr-bg-color: rgba(42, 58, 125, 0.7);
  font-weight: 600;
  color: #fff;
}
.el-table .danger-row {
  --el-table-tr-bg-color: rgba(174, 23, 0, 0.7);
  font-weight: 600;
  color: #fff;
}
.el-table .success-row {
  --el-table-tr-bg-color: rgba(77, 129, 82, 0.7);
  font-weight: 600;
  color: #fff;
}
.el-table .el-icon {
  color: #fff;
  font-weight: 600;
}
.setting-info-table {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
</style>
