<template>
  <dialog-show :title="title" :width="'400px'" :show="show" @closeDialog="closeDialog">
    <template #mainBody>
      <div class="overtime-picker">
        <span>延期时间:</span>
        <el-date-picker
          v-model="overtimeDate"
          type="date"
          placeholder="选择延期时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>
    </template>
    <template #foot>
      <el-button :loading="waitSubmit" type="primary" @click="submitOvertime">提交</el-button>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'OvertimeSetting',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import { ref, watch, watchEffect, defineEmits, inject } from 'vue'
import { handleOvertime, compareDaily } from '@/plugin/daily/status'
const emit = defineEmits(['closeDialog'])

const title = '设置延期完成时间'
const show = inject('showSetOvertime')
const id = inject('overtimeId')
const endTime = inject('overtimeEndTime')
const overtimeDate = ref<string>('')
const waitSubmit = ref<boolean>(false)

const submitOvertime = () => {
  if (overtimeDate.value === '') {
    ElMessage({
      message: '延期时间不能为空！',
      type: 'warning',
    })
  } else if (compareDaily(overtimeDate.value, endTime.value)) {
    ElMessage({
      message: '延期时间不能小于等于当前的结束时间！',
      type: 'error',
    })
  } else {
    waitSubmit.value = true
    handleOvertime(id.value, overtimeDate.value)
      .then((res) => {
        waitSubmit.value = false
        if (res.data.status) {
          ElMessage({
            message: '延期时间修改完成，请务必完成！',
            type: 'success',
          })
          closeDialog()
        } else {
          ElMessage({
            message: '延期时间修改失败，稍后再试！',
            type: 'error',
          })
        }
      })
      .catch((e) => {
        waitSubmit.value = false
        console.log(e)
        ElMessage({
          message: '更新失败！' + e,
          type: 'error',
        })
      })
    setTimeout(() => {}, 500)
  }
}
const closeDialog = (val: boolean = false) => {
  emit('closeDialog', false)
}
watch(
  endTime,
  (newV, oldV) => {
    overtimeDate.value = newV
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.overtime-picker {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
