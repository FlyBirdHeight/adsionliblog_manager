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
        v-if="checkTab == 'category'"
      ></category>
    </el-tab-pane>
    <el-tab-pane label="标签" name="tag">
      <tag v-if="checkTab == 'tag'"></tag>
    </el-tab-pane>
  </el-tabs>
  <add-category @addSuccess="changeCategoryInsertStatus" />
</template>
<script lang="ts">
import { ref, defineComponent, reactive, provide, watchEffect } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { State } from '@/store/index'
import { useStore } from 'vuex'
import Tag from '@/components/pages/category_tag/tag.vue'
import Category from '@/components/pages/category_tag/category.vue'
import AddCategory from '@/components/dialog/body/add_category.vue'
import { deleteCategory, deleteTag } from '@/plugin/page/category_tag/category_tag_handle'
export default defineComponent({
  components: {
    Tag,
    Category,
    AddCategory,
  },
  setup(props, context) {
    const { commit } = useStore<State>()
    const checkTab = ref('category')
    const deleteClick = ref<boolean>(false)
    const insertCategory = ref<boolean>(false)
    const deleteArray = ref<number[]>([])
    const refreshCategoryList = ref<boolean>(false)
    const refreshTagList = ref<boolean>(false)
    provide('insertCategoryStatus', insertCategory)
    provide('deleteCheckedData', deleteClick)
    provide('refreshCategoryList', refreshCategoryList)
    provide('refreshTagList', refreshTagList)

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
            console.log(error)
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
            console.log(error)
          })
      }
    }
    /**
     * @description 上方添加删除按钮的处理方法
     */
    const add = function () {
      if (checkTab.value === 'category') {
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
    watchEffect(() => {
      deleteData()
    })
    
    return {
      checkTab,
      handleClick,
      add,
      insertCategory,
      changeCategoryInsertStatus,
      deleteChecked,
      getDeleteChecked,
      refreshEnd,
      refreshCategoryList,
      refreshTagList
    }
  },
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
