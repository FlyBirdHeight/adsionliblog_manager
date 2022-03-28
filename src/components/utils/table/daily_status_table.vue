<template>
  <el-table border :data="tableData" height="800" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <daily-setting-info :data="props.row"></daily-setting-info>
      </template>
    </el-table-column>
    <el-table-column width="60" label="编号" type="index" :index="indexMethod" />
    <el-table-column label="创建人" width="100" prop="creator" />
    <el-table-column label="开始时间" width="200" prop="start_time" />
    <el-table-column label="结束时间" width="200" prop="end_time" />
    <el-table-column label="日程内容" min-width="300" style="overflow: hidden; text-overflow: ellipsis" prop="target" />
    <el-table-column fixed="right" min-width="300" label="操作">
      <template #default="props">
        <el-button-group>
          <el-button type="danger" @click="destory([props.row.id])">删除</el-button>
          <el-button type="primary" @click="update(props.row.id)">修改</el-button>
          <el-button v-if="props.row.status == 0" type="success" @click="changeStatus(1)">确认</el-button>
          <el-button v-if="props.row.status == 1 || props.row.status == 2" type="success" @click="changeStatus(3)">完成</el-button>
          <el-button v-if="props.row.status == 1" type="danger" @click="changeStatus(2)">延期</el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
export default {
  name: 'DailyStatusTable',
}
</script>
<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect, onMounted, inject } from 'vue'
import DailySettingInfo from '@/components/utils/card/daily_setting_info.vue'
import { DateSetting } from '@/plugin/daily/setting'
import { getStatusList } from '@/plugin/daily/status'

const status = inject('dailyStatus')
const page = inject('page')
const count = inject('count')
const tableData = ref<DateSetting[]>([])

const getList = () => {
  getStatusList(status.value, page.value, count.value)
    .then((res) => {
      tableData.value = res
    })
    .catch((e) => {
      console.log(e)
    })
}
/**
 * @method indexMethod 计算编号
 * @param {number} index 编号
 */
const indexMethod = (index: number) => {
  return (page.value - 1) * count.value + index + 1
}

const destory = (index: number) => {
  console.log(index)
}
const update = (index: number) => {
  console.log(index)
}
/**
 * @description 这个副作用用来监听状态值的改变，页数的改变，页数大小改变，重新获取列表
 */
watchEffect(() => {
  getList()
})
</script>
<style lang="scss" scoped></style>
