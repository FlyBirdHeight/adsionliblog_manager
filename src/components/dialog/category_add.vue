<template>
  <el-dialog
    v-model="visible"
    @close="closeCategoryAddDialog"
    :modal="false"
    :append-to-body="true"
    title="添加分类"
    width="30%"
    draggable
  >
    <category-add-form
      @changeStatus="changeStatus"
      @submitForm="getSubmitFormData"
      :isSubmit="isSubmit"
    ></category-add-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCategoryAddDialog">关闭</el-button>
        <el-button type="primary" @click="submitCategoryAdd">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'CategoryAdd',
}
</script>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import store, { State } from '@/store/index'
import { useStore } from 'vuex'
import CategoryAddForm from '@/components/form/category_add_form.vue'
import { insertCategory } from '../../plugin/page/category_tag/category_tag_add'
const use = useStore<State>()
const commit = use.commit
const state = use.state.dialog
const visible = ref(false)
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
  insertCategory(val);
}
const storeCommitShow = computed(() => {
  return state.categoryAddShow
})
watch(
  storeCommitShow,
  (newV, oldV) => {
    visible.value = newV
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss"></style>
