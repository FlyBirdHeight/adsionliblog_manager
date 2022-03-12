<template>
  <div class="category_tag-top">
    <h1 class="header-title">分类の标签</h1>
    <div class="button-group">
      <el-tooltip effect="dark" content="添加新分类" placement="bottom">
        <el-button color="#8a2be2" :icon="$icon['CirclePlus']" class="button-group-menu" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除选中分类" placement="bottom">
      <el-button color="#ff69b4" :icon="$icon['Delete']" class="button-group-menu" circle></el-button>
      </el-tooltip>
    </div>
  </div>
  <el-tabs v-model="checkTab" @tab-click="handleClick">
    <el-tab-pane label="分类" name="category">
      <category v-if="checkTab == 'category'"></category>
    </el-tab-pane>
    <el-tab-pane label="标签" name="tag">
      <tag v-if="checkTab == 'tag'"></tag>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { ref, defineComponent, reactive } from 'vue';
import { Options, Vue } from 'vue-class-component';
import Tag from '@/components/pages/category_tag/tag.vue';
import Category from '@/components/pages/category_tag/category.vue';
export default defineComponent({
  components: {
    Tag,
    Category,
  },
  setup(props, context) {
    const checkTab = ref('category')
    const handleClick = function (tab: any) {
      console.log(tab.props.label, tab.props.name)
    }
    return {
      checkTab,
      handleClick,
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
