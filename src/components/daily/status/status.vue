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
            @click="deleteCheckedData"
            color="#ff69b4"
            :icon="$icon['Delete']"
            style="color: #fff"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <daily-status-table
      @refreshStatus="setStatus"
      @updateData="getUpdateData"
      @setTotal="setTotal"
    ></daily-status-table>
    <pagination
      style="margin-top: 15px"
      :total-size="total"
      @setCurrentPage="changePageData"
      @setPageSize="changePageData"
    />
    <daily-setting-form-dialog
      :updateForm="dailyUpdateForm"
      @closeDialog="closeFormDialog"
      @updateDailyList="updateDailyList"
    />
  </div>
</template>
<script lang="ts">
import { ref, provide, inject } from 'vue'
import { getStatus } from '@/plugin/daily/setting'
import { formatDate } from '@/utils/date'
import { DateForm } from '@/plugin/daily/form'
export default {
  name: 'DailyStatus',
}
</script>
<script lang="ts" setup>
import Pagination from '@/components/utils/pagination.vue'
import DailyStatusTable from '@/components/utils/table/daily_status_table.vue'
import DailySettingFormDialog from '@/components/dialog/daily/setting_form.vue'
const status = inject('dailyStatus')
/**
 * @property {boolean} refreshStatus 刷新列表
 * @property {number} page 页码
 * @property {number} count 分页数量
 * @property {number} total 总数
 * @property {boolean} showDailyFormDialog 刷新列表
 * @property {string} dateTime 这个dateTime是用来初始化form的起始和结束时间的，为了兼容组件设置的
 * @property {boolean} deleteChecked 用来控制删除的
 * @property {string} formType 表单执行类型
 */
const refreshStatus = ref<boolean>(false)
const page = ref<number>(1)
const count = ref<number>(10)
const total = ref<number>(0)
const showDailyFormDialog = ref<boolean>(false)
const dateTime = ref<string>(formatDate(new Date(), 'yyyy-MM-dd'))
const deleteChecked = ref<boolean>(false)
const formType = ref<string>('insert')
const dailyUpdateForm = ref<DateForm>({
  start_time: '',
  end_time: '',
  creator: '',
  target: '',
  type: 0,
  status: 0,
  send_email: 1,
  email_address: '',
})
provide('page', page)
provide('count', count)
provide('refreshList', refreshStatus)
provide('dateSettingFormShow', showDailyFormDialog)
provide('dateTime', dateTime)
provide('deleteChecked', deleteChecked)
provide('formType', formType)

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
const deleteCheckedData = () => {
  deleteChecked.value = true
}
/**
 * @method addDaily 添加日程
 */
const addDaily = () => {
  dateTime.value = formatDate(new Date(), 'yyyy-MM-dd')
  formType.value = 'insert'
  showDailyFormDialog.value = true
}
/**
 * @method closeFormDialog 关闭表单提交Dialog
 * @param {boolean} val
 */
const closeFormDialog = (val: boolean) => {
  showDailyFormDialog.value = false
}
/**
 * @method refreshList 刷新列表
 */
const refreshList = () => {
  refreshStatus.value = true
}
/**
 * @method setStatus 状态回调，用于emit
 */
const setStatus = (val: boolean, type: string) => {
  if (type == 'refresh') {
    refreshStatus.value = val
  } else if (type === 'delete') {
    //NOTE 删除之后，触发刷新列表操作
    deleteChecked.value = val
    refreshStatus.value = true
  }
}
/**
 * @method getUpdateData 获取更新数据
 * @param {DateForm} val 待修改数据
 */
const getUpdateData = (val: DateForm) => {
  formType.value = 'update'
  dailyUpdateForm.value = val
  showDailyFormDialog.value = true
}
/**
 * @method updateDailyList 当添加日程表单提交成功后，会触发更新回调
 * @param {boolean} val
 */
const updateDailyList = (val: boolean) => {
  if (val) {
    refreshList()
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
