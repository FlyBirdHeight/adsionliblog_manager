<template>
  <div class="presentation-container">
    <div class="presentation-toolbar">
      <div class="toolbal_list" v-for="item of toolbar">
        <el-tooltip effect="light" :content="item.label" v-if="item.icon !== 'divide'" placement="top-start">
          <span @click="handleAction(item.handle)">
            <icon-font class="edit-icon" :icon="item.icon" />
          </span>
        </el-tooltip>
        <div v-else class="toolbar-divide"></div>
      </div>
    </div>
    <div class="presentation-edit">
      <div class="presentation_body" ref="presentationBody" id="presentation_body" @click="handleClick">
        <template v-if="pageMap.item.text.length != 0">
          <resize-element
            @changeStatus="changeStatus"
            @emitActive="emitActive"
            :parent="'presentation_body'"
            v-for="(text, index) of pageMap.item.text"
          >
            <presentation-text :info="text"></presentation-text>
          </resize-element>
        </template>
        <template v-if="pageMap.item.image.length != 0">
          <resize-element :parent="'presentation_body'" v-for="(text, index) of pageMap.item.image">
            <presentation-image v-for="(text, index) of pageMap.item.image"></presentation-image>
          </resize-element>
        </template>
      </div>
      <el-scrollbar :always="true" class="persentation_edit-tool">
        <presentation-edit-tool @setItem="setItem" @setPage="setPage"></presentation-edit-tool>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, provide } from 'vue'
import { PresentationToolbar } from '@/modules/type/site/person/person'
import { toolbarList } from '@/modules/person/presentation/toolbar'
import { handleSetting, setPageMap } from '@/modules/person/presentation/utils/item'
import HandlePresentation from '@/modules/person/presentation/handle'
export default {
  name: 'PresentationContainer',
}
</script>
<script lang="ts" setup>
import ResizeElement from '@/modules/person/presentation/resize/resize.vue'
import PresentationText from '@/modules/person/presentation/text/text.vue'
import PresentationImage from '@/modules/person/presentation/image/image.vue'
import PresentationEditTool from '@/components/site/person/presentation/editTool.vue'
const toolbar = reactive<PresentationToolbar>(toolbarList)
const handleObj = reactive(new HandlePresentation())
/**
 * @property {any} pageMap 当前Page的配置内容
 * @property {any} pageInfo 当前播放页的所有页面信息集合
 */
const pageInfo = reactive({
  currentPage: 0,
  pageCount: 1,
  pageMap: [],
})
const pageMap = reactive(
  {
    item: {
      text: [],
      image: [],
      code: [],
      count: 0,
    },
    setting: {
      background: {
        type: '',
        data: '',
        config: null,
      },
      resolution: {
        x: 1600,
        y: 900,
      },
    },
  },
  { deep: true }
)

const activeItem = ref<number>(-1)
const itemTypeIndexList = ref<{ index: number; type: string }[]>([])
const clickTime = ref<number>(0)
const presentationBody = ref()
provide('itemList', pageMap.item)
provide('activeItem', activeItem)
provide('itemTypeIndexList', itemTypeIndexList)
const handleAction = (action: string) => {
  let fn = Reflect.get(handleObj, action)
  if (action === 'addTextArea') {
    const text = fn(pageMap.item.count + 1)
    pageMap.item.text.push(text)
    activeItem.value = pageMap.item.count + 1
    pageMap.item.count += 1
    itemTypeIndexList.value.push({ index: activeItem.value, type: 'text' })
  }
}
/**
 * @method emitActive 设置选中项的index
 */
const emitActive = (val: number) => {
  activeItem.value = val
}
/**
 * @method handleClick 选中非目标时的activeIndex取消
 */
const handleClick = (e: any) => {
  if (e.timeStamp === clickTime.value) {
    return
  }
  activeItem.value = -1
}
/**
 * @method changeStatus 专门用来处理Active选中取消的点击事件，避免重复执行
 */
const changeStatus = (val: number) => {
  clickTime.value = val
}
const setPage = (val: any, type: string) => {
  handleSetting(presentationBody.value, val, type)
  setPageMap(pageMap, type, val)
}

const setItem = (val: any, type: string) => {}
</script>
<style lang="scss" scoped>
.presentation-container {
  height: 100%;
  width: 100%;
  .presentation-toolbar {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #f2f3f5;
    .toolbal_list span {
      padding: 5px 10px;
      margin: 0 3px;
      cursor: pointer;
    }
    .toolbal_list span:hover {
      border-radius: 5px;
      color: #fff;
      fill: #fff !important;
      background-color: #409eff;
    }
    .toolbal_list .toolbar-divide {
      border: 1px solid #f2f3f5;
      height: 20px;
      margin: auto;
    }
  }
  .presentation-edit {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    height: calc(100% - 41px);
    .presentation_body {
      width: calc(100% - 300px);
      overflow: hidden;
      height: 100%;
      position: relative;
    }
    .persentation_edit-tool {
      width: 300px;
      height: 100%;
      border-left: 1px solid #dcdfe6;
    }
  }
}
</style>
