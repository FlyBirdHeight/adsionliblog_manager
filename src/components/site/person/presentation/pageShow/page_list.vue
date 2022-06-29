<template>
  <el-scrollbar ref="pageShowScroll" :always="true">
    <div class="page-show" ref="pageShowList">
      <div
        class="page-show_item"
        :class="pageInfo.currentPage === index + 1 ? 'page-show_item-active' : ''"
        v-for="(item, index) of pageInfo.pageCount"
      >
        <div class="page-show_item-viewer"></div>
        <div class="page-show_item-number">{{ index + 1 }}</div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, inject, nextTick } from 'vue'
export default {
  name: 'PageListShow',
}
</script>
<script lang="ts" setup>
const pageInfo = inject('pageInfo')
const pageShowScroll = ref()
const pageShowList = ref()
watchEffect(() => {
  let length = pageInfo.pageCount
  if (length > 0) {
    nextTick(() => {
      let children = pageShowList.value.children
      pageShowScroll.value!.setScrollLeft(children[children.length - 1].getBoundingClientRect().x)
      pageShowScroll.value.update()
    })
  }
})
</script>
<style lang="scss" scoped>
.page-show {
  height: 200px;
  width: 100%;
  white-space: nowrap;
  .page-show_item {
    width: 240px;
    height: 100%;
    margin: auto 20px;
    display: inline-block;
    .page-show_item-viewer {
      width: 100%;
      height: 135px;
      transform: translateY(15%);
      background-color: #dcdfe6;
    }
    .page-show_item-number {
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      font-weight: 600;
      transform: translateY(20px);
      text-align: center;
    }
  }
  .page-show_item-active {
    color: #409eff;
    .page-show_item-viewer {
      border: 2px solid #4094ff;
      border-radius: 5px;
    }
  }
}
</style>
