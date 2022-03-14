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
    <el-form-item label="分类备注:" prop="desc">
      <el-input v-model="formData.desc"></el-input>
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
import { ref, unref, defineComponent, reactive, computed, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { CategoryForm, validateName } from '@/plugin/page/category_tag/category_tag_add'
export default defineComponent({
  name: 'CategoryAddForm',
  props: {
    isSubmit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const formData = reactive<CategoryForm>({
      name: '',
      desc: '',
      is_show: true,
      is_recommend: true,
      sort: 0,
    })
    const formSize = 'small'
    const labelPosition = 'left'
    const categoryForm = ref()
    const rules = {
      name: validateName,
    }
    const isSubmitForm = computed(() => {
      return props.isSubmit
    })
    const submitCategoryForm = async () => {
      try {
        const form = unref(categoryForm)
        if (!form) {
          return
        }
        await form.validate((valid, fields) => {
          if (valid) {
            context.emit('getSubmitFormData', formData)
          } else {
            console.log('error submit!', fields)
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
    return {
      formData,
      formSize,
      labelPosition,
      rules,
      submitCategoryForm,
      categoryForm,
    }
  },
})
</script>
<style lang="scss"></style>
