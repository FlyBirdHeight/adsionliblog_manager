<template>
  <el-form ref="form" :model="formData" label-width="auto" label-position="left" size="small">
    <el-form-item label="闪卡名称">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="创建人">
      <el-input v-model="formData.creator" />
    </el-form-item>
    <el-form-item label="闪卡优先级">
      <el-input v-model="formData.sort" />
    </el-form-item>
    <el-form-item label="重要性">
      <el-input v-model="formData.importance" />
    </el-form-item>
    <el-form-item v-for="(question, index) in formData.questions" :label="`问题${index + 1}`">
      <div class="question-form">
        <div class="question-form_item">
          <span>问题:</span>
          <el-input v-model="question.title" />
        </div>
        <div class="question-form_item">
          <span>答案:</span>
          <el-input v-model="question.solution" />
        </div>
        <div class="question-form_item">
          <span>难度:</span>
          <el-radio-group v-model="question.difficulty">
            <el-radio label="hard" size="small">较难</el-radio>
            <el-radio label="normal" size="small">普通</el-radio>
            <el-radio label="easy" size="small">简单</el-radio>
          </el-radio-group>
        </div>
        <div class="question-form_delete">
          <el-button type="danger" plain @click="editQuestion('delete', index)">删除</el-button>
        </div>
      </div>
    </el-form-item>
    <div class="buttom-edit">
      <el-button size="small" type="primary" @click="editQuestion('add')">添加问题</el-button>
      <el-button size="small" type="success">提交</el-button>
      <el-button size="small" type="info" @click="emit('closeDialog')">关闭</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
const formData = reactive<EditCardFold>({
  title: '',
  questions: [
    {
      title: '',
      solution: '',
      difficulty: 'normal',
    },
  ],
  creator: 'adsionli',
  sort: 0,
  importance: false,
})

const emit = defineEmits(['submitForm', 'closeDialog'])
const editQuestion = (type: string, index?: number) => {
  if (type === 'add') {
    formData.questions.push({
      title: '',
      solution: '',
      difficulty: 'normal',
    })
  } else {
    formData.questions.splice(index, 1)
  }
}
</script>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { InsertCardFold, EditCardFold } from '@/modules/type/cardFold'
export default {
  name: 'LearningCardForm',
}
</script>
<style lang="scss" scoped>
.question-form {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 5px 5px 12px 2px rgba(0, 0, 0, 0.08);
  padding: 10px;
  .question-form_item {
    display: flex;
    margin-top: 5px;
    justify-content: flex-start;
    align-items: center;
    span {
      width: 20%;
    }
  }
  .question-form_delete {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
.buttom-edit {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
