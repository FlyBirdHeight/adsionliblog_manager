<template>
  <el-form style="margin-top: 10px" :form="formData" label-position="top" ref="dailySettingFrom">
    <el-form-item label="截止时间:">
      <el-date-picker
        v-model="formData.end_time"
        type="datetime"
        placeholder="设置截止时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-form-item label="学习内容选择:">
      <el-transfer
        v-model="formData.learning_card_list"
        filterable
        :titles="['备选内容', '学习内容']"
        :button-texts="['移除', '添加']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="data"
        @change="handleChange"
      >
        <template #default="{ option }">
          <span>{{ option.key }} - {{ option.label }}</span>
        </template>
      </el-transfer>
    </el-form-item>
    <el-form-item label="额外内容添加:"> </el-form-item>
    <el-form-item label="邮件通知:">
      <el-radio-group v-model="formData.email">
        <el-radio :label="false" size="large" border>不通知</el-radio>
        <el-radio :label="true" size="large" border>通知</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="邮件地址:" v-if="formData.email">
      <el-input v-model="formData.email_address" placeholder="邮件地址" style="width: 300px"/>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { ref, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { DailySetting } from '@/modules/type/daily_learning'
import { formatDate } from '../../../../utils/date'
export default {
  name: 'DayLearningSettingForm',
}
</script>
<script lang="ts" setup>
const emit = defineEmits(['submitSuccess'])
const formData = reactive<DailySetting>({
  learning_card_list: [],
  email: false,
  email_address: '',
  end_time: `${formatDate(new Date())} ${'22:00:00'}`,
  custom_content: [],
})

//NOTE: 穿梭框内容
const generateData = (): Option[] => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
    })
  }
  return data
}
const data = ref(generateData())
/**
 * @method handleChange 处理穿梭框内容选择
 */
const handleChange = (value: number | string, direction: 'left' | 'right', movedKeys: string[] | number[]) => {
  console.log(value, direction, movedKeys)
}
</script>
<style lang="scss" scoped></style>
