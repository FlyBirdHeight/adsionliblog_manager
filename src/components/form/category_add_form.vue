<template>
  <el-form
    ref="categoryFormSubmit"
    :rules="rules"
    :model="formData"
    :size="formSize"
    label-width="auto"
    :label-position="labelPosition"
  >
    <el-form-item label="分类名称:" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="分类备注:" prop="des">
      <el-input v-model="formData.des"></el-input>
    </el-form-item>
    <el-form-item label="是否显示分类:" prop="is_show">
      <el-switch
        v-model="formData.is_show"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="显示"
        inactive-text="隐藏"
      ></el-switch>
    </el-form-item>
    <el-form-item label="是否推荐分类:" prop="is_recommend">
      <el-switch
        v-model="formData.is_recommend"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="推荐"
        inactive-text="不推荐"
      ></el-switch>
    </el-form-item>
    <el-form-item label="显示优先级:" prop="sort">
      <el-input-number v-model="formData.sort" :min="0" :max="99" controls-position="right" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'CategoryAddForm',
}
</script>
<script lang="ts" setup>
import { ref, unref, reactive, computed, watch, defineProps, defineEmits } from 'vue'
import { CategoryForm, validateName } from '@/plugin/page/category_tag/category_tag_handle'
const props = defineProps({
  isSubmit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['submitForm', 'changeStatus'])

const formData = reactive<CategoryForm>({
  name: '',
  des: '',
  is_show: true,
  is_recommend: true,
  sort: 0,
})
const formSize = 'small'
const labelPosition = 'left'
const categoryFormSubmit = ref()
const rules = {
  name: validateName,
}
const isSubmitForm = computed(() => {
  return props.isSubmit
})
const submitCategoryForm = async () => {
  try {
    const form = unref(categoryFormSubmit)
    if (!form) {
      return
    }
    await form.validate((valid, fields) => {
      if (valid) {
        emit('submitForm', formData)
        formData.name = '';
        formData.des = '';
        formData.is_show = true;
        formData.is_recommend = true;
        formData.sort = 0;
      } else {
        emit('changeStatus', false)
      }
    })
  } catch (e) {
    console.log(e)
  }
}
watch(
  isSubmitForm,
  (newV, oldV) => {
    if (newV) {
      submitCategoryForm()
    }
  },
  { immediate: true }
)
</script>
<style lang="scss"></style>
