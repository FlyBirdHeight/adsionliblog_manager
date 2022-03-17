<template>
  <dialog-show :title="dialogConfig.title" :show="dialogConfig.show" @closeDialog="closeCategoryAddDialog">
    <template #mainBody>
      <category-add-form
        @changeStatus="changeStatus"
        @submitForm="getSubmitFormData"
        :isSubmit="isSubmit"
      ></category-add-form>
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
  name: 'AddCategory',
}
</script>
<script lang="ts" setup>
import { ref, reactive, computed, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'
import store, { State } from '@/store/index'
import DialogShow from '@/components/dialog/dialog.vue'
import CategoryAddForm from '@/components/form/category_add_form.vue'
import { insertCategory } from '@/plugin/page/category_tag/category_tag_add'
const dialogConfig = reactive({
  title: '分类添加',
  show: false,
})
const use = useStore<State>()
const commit = use.commit
const state = use.state.dialog
const emit = defineEmits(['addSuccess'])
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
const getSubmitFormData = function (val: any) {
  isSubmit.value = false
  insertCategory(val)
    .then((res) => {
      if (res.data.status) {
        ElMessage({
          message: '分类添加成功',
          type: 'success',
        })
        dialogConfig.show = false
        commit('dialog/setCategoryAddShow', false)
        emit('addSuccess', true)
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
