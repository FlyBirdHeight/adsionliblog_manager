<template>
  <dialog-show :title="dialogConfig.title" :show="dialogConfig.show" @closeDialog="closeCategoryAddDialog">
    <template #mainBody>
      <category-form @changeStatus="changeStatus" @submitForm="getSubmitFormData" :isSubmit="isSubmit"></category-form>
    </template>
    <template #foot>
      <span>
        <el-button @click="closeCategoryAddDialog">关闭</el-button>
        <el-button type="primary" @click="submitCategoryAdd">提交</el-button>
      </span>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'CategoryFormDialog',
}
</script>
<script lang="ts" setup>
import { ref, reactive, computed, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'
import store, { State } from '@/store/index'
import DialogShow from '@/components/dialog/dialog.vue'
import CategoryForm from '@/components/form/page/category_form.vue'
import { insertCategory, update } from '@/plugin/page/category_tag/category_tag_handle'
const dialogConfig = reactive({
  title: '分类添加',
  show: false,
})
const use = useStore<State>()
const commit = use.commit
const state = use.state.dialog

const emit = defineEmits(['submitSuccess'])

const isSubmit = ref(false)
const closeCategoryAddDialog = function () {
  commit('dialog/setCategoryAddShow', false)
}
const submitCategoryAdd = function () {
  isSubmit.value = true
}
const changeStatus = function (val: boolean) {
  isSubmit.value = val
}
/**
 * @method insertForm 添加分类
 * @param {*} form 表单数据
 */
const insertForm = (form) => {
  insertCategory(form.value)
    .then((res) => {
      if (res.data.status) {
        ElMessage({
          message: '分类添加成功',
          type: 'success',
        })
        dialogConfig.show = false
        commit('dialog/setCategoryAddShow', false)
        emit('submitSuccess', true)
      } else {
        ElMessage({
          message: '分类添加失败',
          type: 'error',
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
const updateForm = (form) => {
  update(form.value)
    .then((res) => {
      if (res.data.status) {
        ElMessage({
          message: '分类更新成功',
          type: 'success',
        })
        dialogConfig.show = false
        commit('dialog/setCategoryAddShow', false)
        emit('submitSuccess', true)
      } else {
        ElMessage({
          message: '分类更新失败',
          type: 'error',
        })
      }
    })
    .catch((error) => {
      ElMessage({
        message: '分类更新失败:' + error,
        type: 'error',
      })
    })
}

const getSubmitFormData = function (val: any) {
  isSubmit.value = false
  if (val.type == 'insert') {
    insertForm(val.form)
  } else {
    updateForm(val.form)
  }
}
const storeCommitShow = computed(() => {
  return state.categoryAddShow
})
watch(
  storeCommitShow,
  (newV, oldV) => {
    dialogConfig.show = newV
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss"></style>
