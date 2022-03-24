<template>
  <el-form
    ref="categoryForm"
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
        :active-value="1"
        :inactive-value="0"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="显示"
        inactive-text="隐藏"
      ></el-switch>
    </el-form-item>
    <el-form-item label="是否推荐分类:" prop="is_recommend">
      <el-switch
        v-model="formData.is_recommend"
        :active-value="1"
        :inactive-value="0"
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
  name: 'CategoryForm',
}
</script>
<script lang="ts" setup>
import { ref, unref, reactive, computed, watch, defineProps, defineEmits, inject } from 'vue';
import { CategoryForm, validateName } from '@/plugin/page/category_tag/category_tag_handle'
const props = defineProps({
  isSubmit: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['submitForm', 'changeStatus'])

const formType = ref<string>('insert')
const formData = inject('submitCategoryFormData');
if (formData.id === 0) {
  formType.value = "insert"
  Reflect.deleteProperty(formData, 'id')
} else {
  formType.value = 'update'
}
const formSize = 'small'
const labelPosition = 'left'
const categoryForm = ref()
const rules = {
  name: validateName,
}

const submitCategoryForm = async () => {
  try {
    const form = unref(categoryForm)
    if (!form) {
      emit('changeStatus', false)
      return
    }
    await form.validate((valid, fields) => {
      if (valid) {
        formData.name = ''
        formData.des = ''
        formData.is_show = true
        formData.is_recommend = true
        formData.sort = 0
        emit('submitForm', {
          form: formData,
          type: formType
        })
      } else {
        emit('changeStatus', false)
      }
    })
  } catch (e) {
    console.log(e)
  }
}
watch(
  () => props.isSubmit,
  (newV, oldV) => {
    if (newV) {
      submitCategoryForm()
    }
  },
  { immediate: true }
)
</script>
<style lang="scss"></style>
