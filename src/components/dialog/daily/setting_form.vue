<template>
  <dialog-show :title="title" :width="'35%'" :show="show" @closeDialog="closeDialog">
    <template #mainBody>
      <daily-form :form="form" @submitForm="getFormData" @changeStatus="changeStatus"></daily-form>
    </template>
    <template #foot>
      <el-button :disabled="waitSubmit" type="primary" @click="submitForm">{{formType == 'insert' ? '创建' : '更新' }}</el-button>
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
import { DateForm, insertDailyForm, updateDailyForm } from '@/plugin/daily/form'
import DailyForm from '@/components/form/daily/daily_form.vue'
import DialogShow from '@/components/dialog/dialog.vue'
const props = defineProps<{
  updateForm?: DateForm
}>()
const emit = defineEmits(['closeDialog', 'updateDailyList'])

const dateTime = inject('dateTime')
const show = inject('dateSettingFormShow')
const formType = inject('formType')
const title = ref<string>('添加日程')
const submit = ref<boolean>(false)
const waitSubmit = ref<boolean>(false)
const submitStatus = ref<boolean>(false)
const defaultForm: DateForm = {
  start_time: dateTime.value,
  end_time: dateTime.value,
  creator: '',
  target: '',
  type: 0,
  status: 0,
  send_email: 1,
  email_address: '',
}
const form = ref<DateForm>(defaultForm)
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
  if (Reflect.has(form.value, 'id') && form.value.id != 0) {
    updateData()
  } else {
    insertData()
  }
}
const updateData = () => {
  updateDailyForm(form.value)
    .then((res) => {
      let data = res
      waitSubmit.value = false
      submit.value = false
      if (data.status) {
        ElMessage({
          type: 'success',
          message: '日程更新成功',
        })
        submitStatus.value = true
        emit('updateDailyList', true)
        closeDialog(false)
      } else {
        submitStatus.value = false
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
const insertData = () => {
  insertDailyForm(form.value)
    .then((res) => {
      let status = res
      waitSubmit.value = false
      submit.value = false
      if (status.status) {
        ElMessage({
          type: 'success',
          message: '日程添加成功',
        })
        submitStatus.value = true
        emit('updateDailyList', true)
        closeDialog(false)
      } else {
        submitStatus.value = false
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
const changeStatus = (val: boolean) => {
  submit.value = val
}
const reset = () => {
  submit.value = false
  waitSubmit.value = false
  setTimeout(() => {
    submitStatus.value = false
  }, 200)
}
watch(dateTime, (newV, oldV) => {
  form.value.start_time = newV
  form.value.end_time = newV
})

watch(
  formType,
  (newV, oldV) => {
    if (newV === 'insert') {
      form.value = defaultForm
      title.value = '添加日程'
    } else if (newV === 'update') {
      title.value = '更新日程'
    }
  },
  { immediate: true }
)
watch(
  () => props.updateForm,
  (newV, oldV) => {
    form.value = newV
  }
)
</script>
<style lang="scss" scoped></style>
