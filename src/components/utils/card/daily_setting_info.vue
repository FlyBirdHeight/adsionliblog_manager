<template>
  <div class="daily-setting-info">
    <el-descriptions :column="3" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon style="margin-right: 6px"><component :is="$icon['User']" /></el-icon>
            创建人
          </div>
        </template>
        {{ data.creator }}
      </el-descriptions-item>
      <el-descriptions-item label="起始时间">
        {{ data.start_time }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ data.end_time }}
      </el-descriptions-item>
      <el-descriptions-item :span="3" label="日程内容">
        {{ data.target }}
      </el-descriptions-item>
      <el-descriptions-item label="日程状态">
        <el-tag :color="getStatus(data.status).color" style="color: #fff">
          {{ getStatus(data.status).type }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="日程类型">
        <el-tag :color="getType(data.type).color" style="color: #fff">
          {{ getType(data.type).type }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮件通知">
        <div style="display: flex; align-items: center">
          {{ data.send_email ? '已开启' : '未开启' }}
          <el-icon style="margin-left: 6px">
            <component style="color: #67c23a" v-if="data.send_email" :is="$icon['CircleCheckFilled']" />
            <component style="color: #f56c6c" v-else :is="$icon['CircleCloseFilled']" />
          </el-icon>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="提前开始">
        <el-tag effect="dark" :type="data.is_advance == 1 ? 'warning' : ''">
          {{ data.is_advance == 1 ? '是' : '否' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="提前开始时间" v-if="data.is_advance == 1">
        {{ data.advance_time.substr(0,10) }}
      </el-descriptions-item>
      <el-descriptions-item label="延期完成时间" v-if="data.overtime_date">
        {{ data.overtime_date.substr(0,10) }}
      </el-descriptions-item>
      <el-descriptions-item label="最终完成时间" v-if="data.status == 3">
        {{ data.real_end_time.substr(0,10) }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts">
export default {
  name: 'DailySettingInfo',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { getType, getStatus } from '@/plugin/daily/setting'
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
</script>
<style lang="scss" scoped>
.daily-setting-info {
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .cell-item {
    display: flex;
    align-items: center;
  }
}
</style>
