<template>
  <div class="daily-status-table-info">
    <div class="head">
      <h2 class="head-title">{{ getStatus(status).type + '日程' }}</h2>
      <div class="button-group">
        <el-tooltip effect="dark" content="添加日程" placement="bottom">
          <el-button @click="addDaily" type="warning" :icon="$icon['Edit']" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新列表" placement="bottom">
          <el-button @click="refreshList" type="success" :icon="$icon['Refresh']" circle></el-button>
        </el-tooltip>
        <el-tooltip v-if="status == 0" effect="dark" content="全部确认" placement="bottom">
          <el-button @click="confirmAll" type="primary" :icon="$icon['DocumentChecked']" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除选中" placement="bottom">
          <el-button
            @click="deleteChecked"
            color="#ff69b4"
            :icon="$icon['Delete']"
            style="color: #fff"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <daily-status-table @refreshStatus="setStatus" @setTotal="setTotal"></daily-status-table>
    <pagination
      style="margin-top: 15px"
      :total-size="total"
      @setCurrentPage="changePageData"
      @setPageSize="changePageData"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'DailyStatus',
}
</script>
<script lang="ts" setup>
import Pagination from '@/components/utils/pagination.vue'
import DailyStatusTable from '@/components/utils/table/daily_status_table.vue'
import { ref, provide, inject } from 'vue'
import { getStatus } from '@/plugin/daily/setting'

const status = inject('dailyStatus')

const refreshStatus = ref<boolean>(false)
const page = ref<number>(1)
const count = ref<number>(10)
const total = ref<number>(0)
provide('page', page)
provide('count', count)
provide('refreshList', refreshStatus)
const setTotal = (val: number) => {
  total.value = val
}
const changePageData = (val: PaginationReturn) => {
  if (val.type === 'size') {
    count.value = val.size
  } else {
    page.value = val.size
  }
}
const confirmAll = () => {}
const deleteChecked = () => {}
/**
 * @method addDaily 添加日程
 */
const addDaily = () => {

}
/**
 * @method refreshList 刷新列表
 */
const refreshList = () => {
  refreshStatus.value = true;
}
/**
 * @method setStatus 状态回调，用于emit
 */
const setStatus = (val: boolean, type: string) => {
  if (type == 'refresh') {
    refreshStatus.value = val
  }
}
</script>
<style lang="scss" scoped>
.daily-status-table-info {
  height: 100%;
  padding: 10px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
