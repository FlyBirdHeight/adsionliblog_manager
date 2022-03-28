<template>
  <el-tabs v-model="checkTab" @tab-click="handleClick" type="border-card" class="status-tab">
    <el-tab-pane label="未确认" name="ready">
      <daily-status class="daily-status" v-if="checkTab == 'ready'"></daily-status>
    </el-tab-pane>
    <el-tab-pane label="未开始" name="notstart">
      <daily-status class="daily-status" v-if="checkTab == 'notstart'"></daily-status>
    </el-tab-pane>
    <el-tab-pane label="进行中" name="running">
      <daily-status class="daily-status" v-if="checkTab == 'running'"></daily-status>
    </el-tab-pane>
    <el-tab-pane label="已延期" name="overtime">
      <daily-status class="daily-status" v-if="checkTab == 'overtime'"></daily-status>
    </el-tab-pane>
    <el-tab-pane label="已完成" name="ending">
      <daily-status class="daily-status" v-if="checkTab == 'ending'"></daily-status>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import DailyStatus from '@/components/daily/status/status.vue'
import { ref, reactive, provide } from 'vue'
const checkTab = ref('ready')
const status = ref<number>(0)
provide('dailyStatus', status)
const handleClick = (tab) => {
  switch (tab.props.name) {
    case 'ready':
      status.value = 0
      break
    case 'notstart':
      status.value = 4
      break
    case 'running':
      status.value = 1
      break
    case 'overtime':
      status.value = 2
      break
    case 'ending':
      status.value = 3
      break
    default:
      status.value = 0
      break
  }
  console.log(checkTab.value);
}
</script>
<style lang="scss">
.status-tab {
  height: 100%;
  overflow: auto;
}
.status-tab > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.status-tab .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.status-tab .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
.status-tab .daily-status {
    height: 100%
}
</style>
