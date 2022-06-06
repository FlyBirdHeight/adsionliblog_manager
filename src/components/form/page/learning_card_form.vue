<template>
  <el-scrollbar ref="scrollbarRef" :max-height="`${maxHeight}px`">
    <el-form
      class="create-learning-card-form"
      ref="formRef"
      :model="formData"
      :rules="cardRule"
      label-position="left"
      size="small"
    >
      <el-form-item label="闪卡名称" prop="title">
        <el-input v-model="formData.title" placeholder="闪卡名称" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input v-model="formData.creator" placeholder="创建人" />
      </el-form-item>
      <el-form-item label="闪卡优先级">
        <el-input-number v-model="formData.sort" :step="1" :min="0" :max="99" step-strictly />
        <span style="font-size: 12px; margin-left: 10px; color: #c0c4cc">(优先级越大越优先)</span>
      </el-form-item>
      <el-form-item label="重要性">
        <el-radio-group v-model="formData.importance">
          <el-radio style="margin-right: 10px !important" :label="0" size="small">普通</el-radio>
          <el-radio style="margin-right: 10px !important" :label="1" size="small">重要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-for="(question, index) in formData.questions" :label="`问题${index + 1}`">
        <div class="question-form">
          <el-form
            :ref="(el) => questionRefList.push(el)"
            :model="formData.questions[index]"
            :rules="questionRule"
            label-position="left"
            size="small"
          >
            <el-form-item label="问题:" prop="title">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3 }"
                v-model="question.title"
                placeholder="请输入问题"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="答案:" prop="solution" class="question-form_item">
              <el-input
                v-model="question.solution"
                placeholder="请输入问题答案，支持markdown"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </el-form-item>
            <el-form-item label="难度" class="question-form_item">
              <el-radio-group v-model="question.difficulty">
                <el-radio style="margin-right: 10px !important" :label="2" size="small">较难</el-radio>
                <el-radio style="margin-right: 10px !important" :label="1" size="small">普通</el-radio>
                <el-radio style="margin-right: 10px !important" :label="0" size="small">简单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="question-form_delete">
            <el-button @click="writeSolution(index, question.title, question.solution)" plain type="primary"
              >编辑答案</el-button
            >
            <el-button type="danger" plain @click="editQuestion('delete', index)">删除</el-button>
          </div>
        </div>
      </el-form-item>
      <div class="buttom-edit">
        <el-button size="small" type="primary" :loading="submitDataLoading" @click="editQuestion('add')"
          >添加问题</el-button
        >
        <el-button size="small" type="warning" :loading="submitDataLoading" @click="resetFormData">重置</el-button>
        <el-button size="small" type="success" :loading="submitDataLoading" @click="submit">提交</el-button>
        <el-button size="small" type="info" :loading="submitDataLoading" @click="emit('closeDialog')">关闭</el-button>
      </div>
    </el-form>
  </el-scrollbar>
  <edit-solution-data
    @closeDialog="closeDialog"
    :show="editSolution.show"
    :title="editSolution.title"
    :index="editSolution.index"
    :page="editSolution.page"
    @setSolution="setSolution"
  ></edit-solution-data>
</template>

<script lang="ts" setup>
import EditSolutionData from '@/components/dialog/page/learning_card/edit_solution.vue'
const formData = reactive<EditCardFold>({
  title: '',
  questions: [
    {
      title: '',
      solution: '',
      difficulty: 0,
    },
  ],
  creator: 'adsionli',
  sort: 0,
  importance: 0,
})
let oldData = []
const emit = defineEmits(['closeDialog', 'updateList', 'updateShowData'])
const props = defineProps({
  type: {
    type: String,
    default: 'add',
  },
  cardInfo: {
    type: Object,
    default: null,
  },
})
watch(
  () => props.cardInfo,
  (newV, oldV) => {
    if (newV && props.type === 'update') {
      oldData = []
      oldData.push(...props.cardInfo.questions.map((v) => Object.assign({}, toRaw(v))))
      for (let key of Reflect.ownKeys(formData)) {
        if (key === 'questions' && props.cardInfo[key].length != 0) {
          formData[key] = props.cardInfo[key].map((v) => {
            Reflect.deleteProperty(v, 'created_at')
            Reflect.deleteProperty(v, 'updated_at')
            return v
          })
          continue
        }
        formData[key] = props.cardInfo[key]
      }
      formData['id'] = props.cardInfo.id
    }
  },
  {
    immediate: true,
  }
)
/**
 * @property {string} editType 提交数据的形式
 * @property {FormInstance} formRef form表单实例
 * @property {number} maxHeight 表单滑动最大高度
 * @property {FormRules} cardRule 闪卡提交效验规则
 * @property {FormRules} questionRule 问题提交效验规则
 * @property {Array} questionRefList 用来获取question的form对象，然后效验数据
 * @property {boolean} submitDataLoading 提交的loading
 */
const editType = ref<string>('add')
const formRef = ref<FormInstance>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const maxHeight = ref<number>(600)
const cardRule = reactive<FormRules>(LearningCardRule)
const questionRule = reactive<FormRules>(QuestionRule)
const questionRefList = ref([])
const submitDataLoading = ref<boolean>(false)
const editSolution = reactive({
  show: false,
  index: 0,
  title: '',
  page: '',
})
/**
 * @method writeSolution 编写答案
 * @param {number} index
 */
const writeSolution = (index: number, title: string, page: string) => {
  editSolution.show = true
  editSolution.title = title || '答案编辑'
  editSolution.index = index
  editSolution.page = page
}
const setSolution = (val: string, index: number) => {
  formData.questions[index].solution = val
}
const closeDialog = () => {
  editSolution.show = false
  editSolution.index = 0
  editSolution.title = ''
  editSolution.page = ''
}
/**
 * @method editQuestion 修改问题内容
 * @param {string} type 处理类型
 * @param {number} index 处理的下标
 */
const editQuestion = (type: string, index?: number) => {
  questionRefList.value = []
  if (type === 'add') {
    formData.questions.push({
      title: '',
      solution: '',
      difficulty: 0,
    })
    nextTick(() => {
      scrollbarRef.value.setScrollTop(formRef.value.$el.clientHeight)
    })
  } else {
    if (formData.questions.length == 1) {
      ElMessage({
        message: '至少保留一个问题！',
        grouping: true,
        type: 'warning',
      })
      return
    }
    formData.questions.splice(index, 1)
  }
}
const resetFormData = () => {
  formRef.value.resetFields()
  formData.questions = [
    {
      title: '',
      solution: '',
      difficulty: 0,
    },
  ]
}
/**
 * @method submit 提交数据
 */
const submit = async () => {
  submitDataLoading.value = true
  //NOTE: 首先效验不是动态添加的数据,这里要使用两个状态来记录是否都符合提交需求
  let cardStatus = false
  let questionsStatus = true
  if (!formRef.value) {
    return
  }
  formRef.value.validate((valid) => {
    if (valid) {
      cardStatus = true
    } else {
      cardStatus = false
      return false
    }
  })
  //NOTE: 这里就是通过上面动态绑定ref之后，来遍历存放的数组
  for (let i = 0; i < formData.questions.length; i++) {
    questionRefList.value[i].validate((valid) => {
      if (!valid) {
        questionsStatus = false
        return false
      }
    })
  }
  if (!cardStatus || !questionsStatus) {
    submitDataLoading.value = false
    return
  }
  if (props.type === 'update') {
    let status = await handleUpdateData(oldData, formData)
    if (status) {
      ElMessage({
        message: '闪卡修改成功',
        type: 'success',
      })
    } else {
      ElMessage({
        message: '闪卡修改失败',
        type: 'error',
      })
    }
    submitDataLoading.value = false
    emit('updateShowData', formData.id)
    return
  }
  let status = await submitData('add', formData)
  if (status) {
    ElMessage({
      message: '闪卡创建成功',
      type: 'success',
    })
    submitDataLoading.value = false
    resetFormData()
    emit('updateList')
    emit('closeDialog')
    return
  } else {
    ElMessage({
      message: '闪卡创建失败',
      type: 'error',
    })
  }
  submitDataLoading.value = false
}
</script>
<script lang="ts">
import {
  ref,
  toRef,
  defineProps,
  defineEmits,
  computed,
  watch,
  reactive,
  watchEffect,
  nextTick,
  inject,
  toRaw,
} from 'vue'
import { EditCardFold } from '@/modules/type/cardFold'
import { LearningCardRule, QuestionRule } from '@/plugin/page/learning_card/rule'
import { submitData, handleUpdateData } from '@/plugin/page/learning_card/handle'
export default {
  name: 'LearningCardForm',
}
</script>
<style lang="scss" scoped>
.create-learning-card-form {
  margin: 0 15px 5px 15px;
  height: auto;
}
.question-form {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 5px 5px 12px 2px rgba(0, 0, 0, 0.08);
  padding: 10px;
  .question-form_item {
    margin-top: 20px;
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
