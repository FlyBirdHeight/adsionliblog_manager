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
    <div class="presentation-edit" @keyup.stop="handleKey">
      <div
        class="presentation_body"
        tabindex="-1"
        ref="presentationBody"
        id="presentation_body"
        @click.stop="handleClick"
      >
        <template v-if="pageMap.item.text.length != 0">
          <resize-element
            @changeStatus="changeStatus"
            @emitActive="emitActive"
            :parent="'presentation_body'"
            v-for="(text, index) of pageMap.item.text"
            :key="text.index"
          >
            <presentation-text :info="text"></presentation-text>
          </resize-element>
        </template>
        <template v-if="pageMap.item.image.length != 0">
          <resize-element
            @changeStatus="changeStatus"
            @emitActive="emitActive"
            :parent="'presentation_body'"
            v-for="(image, index) of pageMap.item.image"
            :key="image.index"
          >
            <presentation-image :info="image"></presentation-image>
          </resize-element>
        </template>
      </div>
      <el-scrollbar :always="true" class="persentation_edit-tool">
        <presentation-edit-tool @setPage="setPage"></presentation-edit-tool>
      </el-scrollbar>
    </div>
  </div>
  <edit-body-image-setting
    :show="showUploadImage"
    :savePath="'/preventation'"
    :type="'image'"
    @closeDialog="closeDialog"
    @setImagePath="setImage"
  ></edit-body-image-setting>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, provide, shallowReactive } from 'vue'
import { PresentationToolbar } from '@/modules/type/site/person/person'
import { toolbarList } from '@/modules/person/presentation/toolbar'
import { analysisBackground, setPageMap, handleToolAction } from '@/modules/person/presentation/utils/item'
import HandlePresentation from '@/modules/person/presentation/handle'
import { getHandleKeyDownData } from '@/modules/person/presentation/utils/key_input'
export default {
  name: 'PresentationContainer',
}
</script>
<script lang="ts" setup>
import ResizeElement from '@/modules/person/presentation/resize/resize.vue'
import PresentationText from '@/modules/person/presentation/text/text.vue'
import PresentationImage from '@/modules/person/presentation/image/image.vue'
import PresentationEditTool from '@/components/site/person/presentation/edit/editTool.vue'
import EditBodyImageSetting from '@/components/dialog/presentation/edit/image_setting.vue'

const toolbar = reactive<PresentationToolbar>(toolbarList)
const handleObj = reactive(new HandlePresentation())
/**
 * @property {any} pageMap 当前Page的配置内容
 * @property {any} pageInfo 当前播放页的所有页面信息集合
 * @property {number} activeItem 选中内容的index
 * @property {itemType: {index: number, type: string}[]} itemTypeIndexList item内容的index记录表
 * @property {number} clickTime 鼠标抬起时的高精度事件记录，用于阻止相关事件执行
 * @property {boolean} showUploadImage 显示上传图片框
 */
const pageInfo = reactive({
  currentPage: 0,
  pageCount: 1,
  pageMap: [],
})
const pageMap = reactive(handleObj.pageList.get(pageInfo.currentPage))
const activeItem = ref<number>(-1)
const itemTypeIndexList = reactive<{ index: number; type: string }[]>(handleObj.itemTypeIndexList)
const clickTime = ref<number>(0)
const presentationBody = ref()
const showUploadImage = ref<boolean>(false)
provide('itemList', pageMap.item)
provide('activeItem', activeItem)
provide('itemTypeIndexList', itemTypeIndexList)
provide('handleObj', handleObj)
const handleAction = async (action: string, options: any) => {
  if (action === 'addImage' && !options) {
    showUploadImage.value = true
    return
  }
  await handleToolAction(pageMap, handleObj, action, options, activeItem)
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
  setPageMap(handleObj, type, val, pageMap)
}
/**
 * @method closeDialog 关闭弹窗
 */
const closeDialog = () => {
  showUploadImage.value = false
}
/**
 * @method setImage 添加图片Item，通过上传后的回调
 * @param {string} url 图片Url
 */
const setImage = (url: string) => {
  handleAction('addImage', { url })
}
/**
 * @method handleKey 处理键盘按下事件
 */
const handleKey = (event: Event) => {
  if (event.path[0].id !== 'presentation_body') {
    return
  }
  console.log(event)

  let keyDownData = getHandleKeyDownData(event)

  handleObj.keyInput(keyDownData, {
    activeIndex: activeItem,
    itemList: itemTypeIndexList,
    currentPage: pageInfo.currentPage,
  })
}
watch(
  () => pageMap.setting.background,
  (newV, oldV) => {
    analysisBackground(newV, presentationBody.value)
  }
)
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
      outline: none;
    }
    .persentation_edit-tool {
      width: 300px;
      height: 100%;
      border-left: 1px solid #dcdfe6;
    }
  }
}
</style>
