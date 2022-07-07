<template>
  <div style="max-height: 210px">
    <el-scrollbar ref="pageShowScroll" :always="true" :height="210">
      <div class="page-show" ref="pageShowList">
        <div
          class="page-show_item"
          :class="pageInfo.currentPage === index + 1 ? 'page-show_item-active' : ''"
          v-for="(item, index) of pageInfo.pageCount"
          @click="changePage(index + 1)"
          :ref="(el) => pageItemList.push(el)"
        >
          <div class="page-show_item-viewer">
            <el-image
              v-if="pageImage.length != 0"
              style="width: 100%; height: 100%"
              :src="imageList[index]"
              fit="fill"
            />
          </div>
          <div class="page-show_item-number">{{ index + 1 }}</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, inject, nextTick } from 'vue'
import { setPage } from '@/modules/person/presentation/utils/item'
export default {
  name: 'PageListShow',
}
</script>
<script lang="ts" setup>
const pageInfo = inject('pageInfo')
const handleObj = inject('handleObj')
const pageImage = inject('pageImage')
const imageList = ref([''])
const pageShowScroll = ref()
const pageShowList = ref()
const pageItemList = ref([])
const changePage = (page: number) => {
  handleObj.goPage(page)
  setPage(pageInfo, handleObj)
  let dom = pageItemList.value[page - 1]
  let scrollLeft = 0
  if (page === pageItemList.value.length) {
    scrollLeft = dom.getBoundingClientRect().x
  } else {
    scrollLeft = dom.getBoundingClientRect().x - pageShowList.value.getBoundingClientRect().x
  }

  pageShowScroll.value!.setScrollLeft(scrollLeft)
  pageShowScroll.value.update()
}
const getPageImage = (page: number) => {
  let idx = pageImage.value.findIndex((v) => v.page === page)
  if (idx === -1) {
    return ''
  } else {
    return pageImage.value[idx].image
  }
}
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
watch(
  pageImage,
  (newV, oldV) => {
    newV.forEach((v, i) => {
      imageList.value[i] = v.image
    })
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
.page-show {
  height: 200px;
  width: 100%;
  white-space: nowrap;
  .page-show_item {
    width: 210px;
    height: 100%;
    margin: auto 20px;
    display: inline-block;
    cursor: pointer;
    .page-show_item-viewer {
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      width: 100%;
      height: 140px;
      transform: translateY(15%);
      background-color: #ffffff;
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
      border: 3px solid #4094ff;
      border-radius: 5px;
    }
  }
}
</style>
