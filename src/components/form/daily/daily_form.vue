<template>
  <el-form
    v-load="waitSubmit"
    ref="dailyForm"
    :rules="rules"
    :model="formData"
    :size="'small'"
    label-width="auto"
    :label-position="'left'"
  >
    <el-form-item label="起始时间:" prop="start_time">
      <el-date-picker
        v-model="formData.start_time"
        type="date"
        placeholder="选择起始时间"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>
    <el-form-item label="结束时间:" prop="end_time">
      <el-date-picker
        v-model="formData.end_time"
        type="date"
        placeholder="选择结束时间"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>
    <el-form-item label="创建人:" prop="creator">
      <el-input v-model="formData.creator" placeholder="输入日程创建人" clearable />
    </el-form-item>
    <el-form-item label="日程内容:" prop="target">
      <el-input
        v-model="formData.target"
        maxlength="1000"
        placeholder="输入日程内容"
        rows="5"
        clearable
        show-word-limit
        type="textarea"
      />
    </el-form-item>
    <el-form-item label="事件类型:" prop="type">
      <el-select v-model="formData.type" placeholder="选择事件类型">
        <el-option
          v-for="item in dateType"
          :key="item.value"
          :label="item.label"
          style="display: flex; align-items: center; justify-content: space-between"
          :value="item.value"
        >
          <span>
            {{ item.label }}
          </span>
          <span style="width: 8px; height: 8px" :style="{ 'background-color': item.color }" />
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态:" prop="status">
      <el-radio v-model="formData.status" :label="0" border>待确认</el-radio>
      <el-radio v-model="formData.status" :label="1" border>进行中</el-radio>
    </el-form-item>
    <el-form-item label="邮件通知:" prop="send_email">
      <el-radio v-model="formData.send_email" :label="0" border>不通知</el-radio>
      <el-radio v-model="formData.send_email" :label="1" border>通知</el-radio>
    </el-form-item>
    <el-form-item label="邮件地址:" prop="email_address" v-if="formData.send_email == 1">
      <el-input v-model="formData.email_address" placeholder="输入邮件地址" clearable />
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'DailyForm',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, reactive, watchEffect, inject, unref, watch } from 'vue'
import { DateForm, getDailyType } from '@/plugin/daily/form'
const props = defineProps({
  form: {
    type: Object,
    default: {
      start_time: '',
      end_time: '',
      creator: '',
      target: '',
      type: 0,
      status: 0,
      send_email: 1,
      email_address: '',
    },
  },
})
const emit = defineEmits(['submitForm', 'changeStatus'])
const submit = inject('submitForm')
const waitSubmit = inject('waitSubmit')
const submitStatus = inject('submitStatus')
const dailyForm = ref()
const formData = ref<DateForm>(props.form)
const dateType = getDailyType()
/**
 * @method judgeStartTime 表单效验，起始时间
 * @method judgeEndtime 表单效验，结束时间
 */
const judgeStartTime = function (rule: any, value: any, callback: any) {
  if (Number(value.split('-').join('')) > Number(formData.value.end_time.split('-').join(''))) {
    callback(new Error('请确保日程起始时间不大于结束时间'))
  } else {
    callback()
  }
}
const judgeEndTime = function (rule: any, value: any, callback: any) {
  if (Number(value.split('-').join('')) < Number(formData.value.start_time.split('-').join(''))) {
    callback(new Error('请确保日程结束时间不小于起始时间'))
  } else {
    callback()
  }
}
const judgeEmail = function (rule: any, value: string, callback: any) {
  if (formData.value.send_email && value.trimLeft().trimRight().length === 0) {
    callback(new Error('邮件通知开启后，请输入有效的邮件地址'))
  } else {
    callback()
  }
}
/**
 * @property {*} rules 表单验证规则
 */
const rules = reactive({
  start_time: [
    {
      type: 'date',
      required: true,
      message: '请选择日程开始时间',
      trigger: 'blur',
    },
    {
      validator: judgeStartTime,
      trigger: 'blur',
    },
  ],
  end_time: [
    {
      type: 'date',
      required: true,
      message: '请选择日程结束时间',
      trigger: 'blur',
    },
    {
      validator: judgeEndTime,
      trigger: 'blur',
    },
  ],
  creator: [
    {
      required: true,
      message: '请输入日程创建人',
      trigger: 'blur',
    },
  ],
  target: [
    {
      required: true,
      message: '请输入日程内容',
      trigger: 'blur',
    },
  ],
  email_address: [
    {
      validator: judgeEmail,
      trigger: 'blur',
    },
  ],
})

const submitForm = async () => {
  try {
    if (submit.value) {
      const form = unref(dailyForm)
      if (!form) {
        emit('changeStatus', false)
        return
      }
      await form.validate((valid, fileds) => {
        if (valid) {
          emit('submitForm', formData.value)
        } else {
          emit('changeStatus', false)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

watch(submitStatus, (newV, oldV) => {
  console.log(newV)
  if (newV) {
    formData.value = {
      start_time: '',
      end_time: '',
      creator: '',
      target: '',
      type: 0,
      status: 0,
      send_email: 1,
      email_address: '',
    }
  }
})
watchEffect(() => {
  submitForm()
})
</script>
<style lang="scss" scoped></style>
