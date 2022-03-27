<template>
  <div class="category_tag-top">
    <h1 class="header-title">分类の标签</h1>
    <div class="button-group">
      <el-tooltip effect="dark" content="添加新分类" placement="bottom">
        <el-button
          color="#8a2be2"
          :icon="$icon['CirclePlus']"
          @click="add"
          class="button-group-menu"
          circle
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除选中分类" placement="bottom">
        <el-button
          @click="deleteChecked"
          color="#ff69b4"
          :icon="$icon['Delete']"
          class="button-group-menu"
          circle
        ></el-button>
      </el-tooltip>
    </div>
  </div>
  <el-tabs v-model="checkTab" @tab-click="handleClick">
    <el-tab-pane label="分类" name="category">
      <category
        @changeCategoryInsertStatus="changeCategoryInsertStatus"
        @deleteCheckedHandle="getDeleteChecked"
        @refreshEnd="refreshEnd"
        @updateData="updateData"
        v-if="checkTab == 'category'"
      ></category>
    </el-tab-pane>
    <el-tab-pane label="标签" name="tag">
      <tag v-if="checkTab == 'tag'"></tag>
    </el-tab-pane>
  </el-tabs>
  <category-form-dialog @submitSuccess="changeCategoryInsertStatus" />
</template>
<script lang="ts" setup>
import { ref, reactive, provide, watchEffect } from 'vue'
import { State } from '@/store/index'
import { useStore } from 'vuex'
import Tag from '@/components/pages/category_tag/tag.vue'
import Category from '@/components/pages/category_tag/category.vue'
import CategoryFormDialog from '@/components/dialog/body/category_form.vue'
import { deleteCategory, deleteTag, CategoryForm } from '@/plugin/page/category_tag/category_tag_handle'

const { commit } = useStore<State>()
const checkTab = ref('category')
const deleteClick = ref<boolean>(false)
const insertCategory = ref<boolean>(false)
const deleteArray = ref<number[]>([])
const refreshCategoryList = ref<boolean>(false)
const refreshTagList = ref<boolean>(false)
const submitCategoryFormData = ref<CategoryForm>({
  id: 0,
  name: '',
  des: '',
  is_show: 1,
  is_recommend: 1,
  sort: 0,
})

provide('insertCategoryStatus', insertCategory)
provide('deleteCheckedData', deleteClick)
provide('refreshCategoryList', refreshCategoryList)
provide('refreshTagList', refreshTagList)
provide('submitCategoryFormData', submitCategoryFormData)

const handleClick = function (tab: any) {
  console.log(tab.props.label, tab.props.name)
}
const deleteData = function () {
  deleteClick.value = false
  if (deleteArray.value.length == 0) {
    return
  }
  if (checkTab.value === 'category') {
    deleteCategory(deleteArray.value)
      .then((res) => {
        if (res) {
          deleteArray.value = []
          refreshCategoryList.value = true
        }
      })
      .catch((error) => {
        ElMessage({
          message: error,
          type: error,
        })
      })
  } else {
    deleteTag(deleteArray.value)
      .then((res) => {
        if (res.data) {
          deleteArray.value = []
          refreshTagList.value = true
        }
      })
      .catch((error) => {
        ElMessage({
          message: error,
          type: error,
        })
      })
  }
}
/**
 * @description 上方添加删除按钮的处理方法
 */
const add = function () {
  if (checkTab.value === 'category') {
    submitCategoryFormData.value = {
      id: 0,
      name: '',
      des: '',
      is_show: 1,
      is_recommend: 1,
      sort: 0,
    }
    console.log(submitCategoryFormData.value)
    commit('dialog/setCategoryAddShow', true)
  } else {
    commit('dialog/setTagAddShow', true)
  }
}
const deleteChecked = function () {
  deleteClick.value = true
}
/**
 * @description 下面部分是用来处理emit组件通信的回调方法
 */
const getDeleteChecked = function (val: number[]) {
  deleteArray.value = val || []
}
//NOTE: 本方法的作用是为了改变categoryList组件中的添加状态的
const changeCategoryInsertStatus = function (val: boolean) {
  insertCategory.value = val
}
const refreshEnd = function (val: boolean) {
  refreshCategoryList.value = false
  refreshTagList.value = false
}
/**
 * @method updateData 更新列表分类书籍 处理emit事件
 * @param {CategoryForm} val 数据
 */
const updateData = function (val: CategoryForm) {
  if (!val) {
    ElMessage({
      message: '当前数据id数据已不存在！请刷新列表！',
      type: 'warning',
    })
  } else {
    //如果传递回来的数据有效，就调用窗口，因为form是这里传递过去provide的，所以在form子组件中接收一下就可以
    if (checkTab.value === 'category') {
      submitCategoryFormData.value = val
      commit('dialog/setCategoryAddShow', true)
    } else {
      commit('dialog/setTagAddShow', true)
    }
  }
}
/**
 * @description 副作用的处理，主要针对删除时候的副作用
 */
watchEffect(() => {
  deleteData()
})
</script>
<style lang="scss" scoped>
.category_tag-top {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: inherit;
  }
  .button-group {
    .button-group-menu {
      color: white;
      font-size: 16px;
    }
  }
}
</style>
