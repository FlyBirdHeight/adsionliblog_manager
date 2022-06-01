<template>
  <el-table
    border
    ref="dailyTableMultip"
    @selection-change="handleSelectionChange"
    :data="tableData"
    height="600"
    style="width: 100%"
    class="daily_status-table"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="expand">
      <template #default="props">
        <daily-setting-info :data="props.row"></daily-setting-info>
      </template>
    </el-table-column>
    <el-table-column width="60" label="编号" type="index" :index="indexMethod" />
    <el-table-column label="创建人" width="100" prop="creator" />
    <el-table-column label="开始时间" width="130" prop="start_time" />
    <el-table-column label="结束时间" width="130" prop="end_time" />
    <el-table-column label="日程内容" min-width="240" prop="target" />
    <el-table-column fixed="right" min-width="280" label="操作">
      <template #default="props">
        <el-button-group>
          <el-popconfirm
            confirm-button-text="删除"
            cancel-button-text="关闭"
            :icon="$icon['InfoFilled']"
            icon-color="red"
            title="确认是否删除该日程，一旦删除无法恢复！"
            @confirm="deleteData(props.row.id)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="update(props.row)">修改</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="关闭"
            :icon="$icon['DocumentChecked']"
            icon-color="#67C23A"
            title="提前开始日程！"
            @confirm="advanceDaily(props.row.id)"
            v-if="props.row.status == 4"
          >
            <template #reference>
              <el-button type="success"> 提前开始 </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="props.row.status == 0"
            type="success"
            @click="changeStatus(props.row.id, 1, 'normal', props.row.start_time)"
            >确认</el-button
          >
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="关闭"
            :icon="$icon['Finished']"
            icon-color="#67C23A"
            title="确认是否完成了日程，一定要完成才能结束哟！"
            @confirm="changeStatus(props.row.id, 3)"
            v-if="props.row.status == 1 || props.row.status == 2"
          >
            <template #reference>
              <el-button type="success">完成</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="props.row.status == 1"
            type="danger"
            @click="changeStatus(props.row.id, 2, 'overtime', props.row.end_time)"
            >延期</el-button
          >
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <overtime-setting @closeDialog="closeDialog" />
</template>
<script lang="ts">
export default {
  name: 'DailyStatusTable',
}
</script>
<script lang="ts" setup>
import { ref, watch, watchEffect, inject, defineEmits, provide, toRefs } from 'vue'
import OvertimeSetting from '@/components/dialog/daily/overtime.vue'
import DailySettingInfo from '@/components/utils/card/daily_setting_info.vue'
import { DateSetting } from '@/plugin/daily/setting'
import {
  getStatusList,
  handleOvertime,
  updateData,
  advancedDaily,
  compareDaily,
  deleteDaily,
} from '@/plugin/daily/status'
import { formatDate } from '../../../utils/date'
const emit = defineEmits(['setTotal', 'refreshStatus', 'updateData'])

const status = inject('dailyStatus')
const page = inject('page')
const count = inject('count')
const refreshList = inject('refreshList')
const deleteChecked = inject('deleteChecked')
/**
 * @property {InstanceType<typeof ElTable>} dailyTableMultip 这个是用来获取模板中的ref对象的那个table的
 * @property {number[]} checkedValue 用来保存选中框中的内容的
 */
const dailyTableMultip = ref<InstanceType<typeof ElTable>>()
const checkedValue = ref<number[]>([])
/**
 * @description 下面的三个属性都是用来控制延期时，重新选择延期完成时间时传入到Dialog中的参数
 * @property {boolean} setOvertime 控制延时完成时间选择dialog的显示
 * @property {number} overtimeId 需要调整延期的日程id
 * @property {string} overtimeEndTime 一个初始化延期时间，主要用来效验最后的延期时间不得小于原本计划的时间
 */
const setOvertime = ref<boolean>(false)
const overtimeId = ref<number>(-1)
const overtimeEndTime = ref<string>('')
provide('showSetOvertime', setOvertime)
provide('overtimeId', overtimeId)
provide('overtimeEndTime', overtimeEndTime)

const tableData = ref<DateSetting[]>([])
/**
 * @method getList 获取日程列表
 */
const getList = () => {
  getStatusList(status.value, page.value, count.value)
    .then((res) => {
      tableData.value = res
      emit('setTotal', res.length)
      emit('refreshStatus', false, 'refresh')
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
const handleSelectionChange = (val: any[]) => {
  checkedValue.value = []
  val.forEach((v) => {
    checkedValue.value.push(v.id)
  })
}
/**
 * @method update 更新日程
 * @param {DateSetting} info 日程内容
 */
const update = (info: DateSetting) => {
  let data = JSON.parse(JSON.stringify(Object.assign({}, info)))
  emit('updateData', data)
}
/**
 * @method changeStatus 修改状态
 * @param {number} id 日程id
 * @param {number} status 修改后日程状态
 * @param {string} type 修改类型
 */
const changeStatus = (id: number, status: number, type: string = 'normal', time?: string) => {
  if (type == 'overtime') {
    overtimeId.value = id
    setOvertime.value = true
    overtimeEndTime.value = time
  } else {
    if (status === 1) {
      if (!compareDaily(time, formatDate(new Date(), 'yyyy-MM-dd'))) {
        status = 4
      }
    }
    updateData(id, status)
      .then((res) => {
        if (res.data.status) {
          ElMessage({
            message: '日程确认成功！',
            type: 'success',
          })
          getList()
        } else {
          ElMessage({
            message: '日程确认失败！' + Reflect.has(res.data, 'data') ? res.data.data : '',
            type: 'error',
          })
        }
      })
      .catch((error) => {
        ElMessage({
          message: '日程确认失败！' + error,
          type: 'error',
        })
      })
  }
}
/**
 * @method advanceDaily 提前开始日程
 * @param {number} id 日程id
 */
const advanceDaily = async (id: number) => {
  try {
    let status = await advancedDaily(id)
    if (status.data.status) {
      ElMessage({
        message: '开始成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '开始失败!' + (status.data | ''),
        type: 'error',
      })
    }
    emit('refreshStatus', true, 'refresh')
  } catch (e) {
    ElMessage({
      message: '提前开始失败!' + e,
      type: 'error',
    })
    emit('refreshStatus', true, 'refresh')
  }
}
/**
 * @method closeDialog 关闭对话框,用于提交表单之后
 * @param {boolean} val
 */
const closeDialog = (val: boolean) => {
  setOvertime.value = val
}
/**
 * @method clearSelection 清空列表选项
 */
const clearSelection = function () {
  dailyTableMultip.value!.clearSelection()
}
/**
 * @method deleteData 删除数据
 */
const deleteData = async (id?: number) => {
  try {
    let status = await deleteDaily(id ? [id] : checkedValue.value)
    if (status.status) {
      ElMessage({
        message: '删除成功！',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '删除失败!' + (status.data | ''),
        type: 'error',
      })
    }
    emit('refreshStatus', false, 'delete')
  } catch (e) {
    ElMessage({
      message: '删除失败!' + e,
      type: 'error',
    })
    emit('refreshStatus', false, 'delete')
  }
}
watch(deleteChecked, (newV, oldV) => {
  if (newV) {
    deleteData()
  }
})
//NOTE 下方均为监听副作用的模块内容
/**
 * @description 这个副作用用来监听状态值的改变，页数的改变，页数大小改变，重新获取列表
 */
watchEffect(() => {
  getList()
})
/**
 * @description 本副作用用来监听刷新列表按钮点击事件、设置超时时间、删除操作的副作用
 */
watchEffect(() => {
  if (refreshList.value || setOvertime.value) {
    getList()
  }
})
</script>
<style lang="scss">
.daily_status-table {
  td.el-table__cell div {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}
</style>
