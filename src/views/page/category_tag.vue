<template>
  <div class="category_tag-top">
    <h1 class="header-title">分类の标签</h1>
    <div class="button-group">
      <el-tooltip effect="dark" content="添加新分类" placement="bottom">
        <el-button
          color="#8a2be2"
          :icon="$icon['CirclePlus']"
          @click="addCategory"
          class="button-group-menu"
          circle
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除选中分类" placement="bottom">
        <el-button color="#ff69b4" :icon="$icon['Delete']" class="button-group-menu" circle></el-button>
      </el-tooltip>
    </div>
  </div>
  <el-tabs v-model="checkTab" @tab-click="handleClick">
    <el-tab-pane label="分类" name="category">
      <category @changeCategoryInsertStatus="changeCategoryInsertStatus" v-if="checkTab == 'category'"></category>
    </el-tab-pane>
    <el-tab-pane label="标签" name="tag">
      <tag v-if="checkTab == 'tag'"></tag>
    </el-tab-pane>
  </el-tabs>
  <category-add @addSuccess="addSuccess" />
</template>
<script lang="ts">
import { ref, defineComponent, reactive, provide } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { State } from '@/store/index'
import { useStore } from 'vuex'
import Tag from '@/components/pages/category_tag/tag.vue'
import Category from '@/components/pages/category_tag/category.vue'
import CategoryAdd from '@/components/dialog/category_add.vue'
export default defineComponent({
  components: {
    Tag,
    Category,
    CategoryAdd,
  },
  setup(props, context) {
    const {commit} = useStore<State>()
    const checkTab = ref('category')
    const insertCategory = ref<boolean>(false)
    const handleClick = function (tab: any) {
      console.log(tab.props.label, tab.props.name)
    }
    const addCategory = function () {
      commit('dialog/setCategoryAddShow', true);
    }
    const addSuccess = function(val: boolean) {
      insertCategory.value = val;
    }
    const changeCategoryInsertStatus = function(val:boolean) {
      insertCategory.value = val;
    }
    provide('insertCategoryStatus', insertCategory);
    return {
      checkTab,
      handleClick,
      addCategory,
      addSuccess,
      insertCategory,
      changeCategoryInsertStatus
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
