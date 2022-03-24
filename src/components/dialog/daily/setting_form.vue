<template>
  <dialog-show :title="title" :width="'35%'" :show="show" @closeDialog="closeDialog">
    <template #mainBody>
      <daily-form :form="form" @submitForm="getFormData" @changeStatus="changeStatus"></daily-form>
    </template>
    <template #foot>
      <el-button :disabled="waitSubmit" type="primary" @click="submitForm">创建</el-button>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'DailySettingFormDialog',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, inject, provide } from 'vue'
import { DateForm, insertDailyForm } from '@/plugin/daily/form'
import DailyForm from '@/components/form/daily/daily_form.vue'
import DialogShow from '@/components/dialog/dialog.vue'
const emit = defineEmits(['closeDialog'])

const dateTime = inject('dateTime')
const show = inject('dateSettingFormShow')
const title = ref<string>('添加日程')
const submit = ref<boolean>(false)
const waitSubmit = ref<boolean>(false)
const submitStatus = ref<boolean>(false)
const form = ref<DateForm>({
  start_time: dateTime.value,
  end_time: dateTime.value,
  creator: '',
  target: '',
  type: 0,
  status: 0,
  send_email: 1,
  email_address: '',
})
provide('submitForm', submit)
provide('waitSubmit', waitSubmit)
provide('submitStatus', submitStatus)
/**
 * @method closeDialog 关闭dialog显示的回调，也可以用于主动关闭
 * @param {boolean} val
 */
const closeDialog = (val: boolean = false) => {
  reset()
  emit('closeDialog', val)
}
const submitForm = () => {
  submit.value = true
}
const getFormData = (val: DateForm) => {
  waitSubmit.value = true
  form.value = val
  submit.value = false
  insertData()
}
const insertData = async () => {
  try {
    let status = await insertDailyForm(form.value)
    waitSubmit.value = false
    submit.value = false
    if (status.status) {
      ElMessage({
        message: '日程添加成功',
        type: 'success',
      })
      submitStatus.value = true
      closeDialog(false)
    } else {
      submitStatus.value = false
    }
  } catch (e) {
    console.log(e)
    ElMessage({
      message: '日程添加失败：' + e,
      type: 'error',
    })
  }
}
const changeStatus = (val: boolean) => {
  submit.value = val
}
const reset = () => {
  submit.value = false
  submitStatus.value = false
  waitSubmit.value = false
}
watch(dateTime, (newV, oldV) => {
  form.value.start_time = newV
  form.value.end_time = newV
})
</script>
<style lang="scss" scoped></style>
