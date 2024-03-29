<template>
  <div class="presentation-container" v-load="saveOrUpdateData" :element-loading-text="loadingText">
    <page-list-show></page-list-show>
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
    <div class="presentation-edit" @keyup.stop="handleKey" v-load="changePage" element-loading-text="正在切换">
      <div
        class="presentation_body"
        tabindex="-1"
        ref="presentationBody"
        id="presentation_body"
        @click.stop="handleClick"
      >
        <template v-if="pageMap.item.text.length != 0" v-for="(text, index) of pageMap.item.text" :key="text.index">
          <item-animation :play="runningItem">
            <resize-element @changeStatus="changeStatus" @emitActive="emitActive" :parent="'presentation_body'">
              <presentation-text :info="text"></presentation-text>
            </resize-element>
          </item-animation>
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
    <edit-body-image-setting
      :show="showUploadImage"
      :savePath="'/preventation'"
      :type="'image'"
      @closeDialog="closeDialog"
      @setImagePath="setImage"
    ></edit-body-image-setting>
  </div>

  <pre-render-container
    @getPage="getPreRenderPage"
    @getRef="getPreRenderPageRef"
    :display="projection"
    :flyToBody="!projection"
    @clostProjection="projection = false"
  ></pre-render-container>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect, provide, shallowReactive, nextTick, onMounted, inject } from 'vue'
import { PresentationToolbar } from '@/modules/type/site/person/person'
import { toolbarList } from '@/modules/person/presentation/toolbar'
import { analysisBackground, setPageMap, handleToolAction } from '@/modules/person/presentation/utils/item'
import HandlePresentation from '@/modules/person/presentation/handle'
import { generatePageImage } from '@/modules/person/presentation/utils/utils'
import { getHandleKeyDownData } from '@/modules/person/presentation/utils/key_input'
import useProjection from './hooks/show'
export default {
  name: 'PresentationContainer',
}
</script>
<script lang="ts" setup>
import PageListShow from '@/components/site/person/presentation/pageShow/page_list.vue'
import ResizeElement from '@/modules/person/presentation/resize/resize.vue'
import PresentationText from '@/modules/person/presentation/text/text.vue'
import PresentationImage from '@/modules/person/presentation/image/image.vue'
import PresentationEditTool from '@/components/site/person/presentation/edit/editTool.vue'
import EditBodyImageSetting from '@/components/dialog/presentation/edit/image_setting.vue'
import ItemAnimation from '@/modules/person/presentation/animation/item_animation.vue'
import PreRenderContainer from '@/modules/person/presentation_show/render/preRender.tsx'
const toolbar = reactive<PresentationToolbar>(toolbarList)
const handleObj = reactive(new HandlePresentation())
const presentationContainer = inject('personPresentation')
/**
 * @property {any} pageMap 当前Page的配置内容
 * @property {any} pageInfo 当前播放页的所有页面信息集合
 * @property {number} activeItem 选中内容的index
 * @property {itemType: {index: number, type: string}[]} itemTypeIndexList item内容的index记录表
 * @property {number} clickTime 鼠标抬起时的高精度事件记录，用于阻止相关事件执行
 * @property {boolean} showUploadImage 显示上传图片框
 * @property {Array} pageImage 保存page的样子的Image列表
 * @property {boolean} saveOrUpdateData 用于控制保存或更新时的loading
 */
const pageInfo = reactive({
  currentPage: 1,
  pageCount: 1,
})
const pageMap = ref(handleObj.currentPageData)
const activeItem = ref<number>(-1)
const itemTypeIndexList = ref<{ index: string; type: string }[]>(handleObj.itemTypeIndexList)
const clickTime = ref<number>(0)
const presentationBody = ref()
const preRender = ref(null)
const showUploadImage = ref<boolean>(false)
const pageImage = ref([])
const changePage = ref<boolean>(false)
const runningItem = ref<boolean>(false)
const saveOrUpdateData = ref<boolean>(false)
const isSave = ref<boolean>(true)
const loadingText = ref<string>('正在保存/更新，请稍后')
const projection = useProjection(preRender, handleObj)
provide('itemList', pageMap)
provide('activeItem', activeItem)
provide('itemTypeIndexList', itemTypeIndexList)
provide('handleObj', handleObj)
provide('pageInfo', pageInfo)
provide('pageImage', pageImage)
onMounted(async () => {
  loadingText.value = '正在加载，请稍后'
  saveOrUpdateData.value = true
  await handleObj.getPresentationData()
  isSave.value = handleObj.isSave
  if (isSave.value) {
    saveOrUpdateData.value = false
  }
  pageMap.value = handleObj.currentPageData
  pageInfo.pageCount = handleObj.pageList.size
  itemTypeIndexList.value = handleObj.itemTypeIndexList
})

const handleAction = async (action: string, options: any) => {
  if (action === 'addImage' && !options) {
    showUploadImage.value = true
    return
  } else if (action === 'deletePage') {
    let idx = pageImage.value.findIndex((v) => v.page === pageInfo.currentPage)
    pageImage.value.splice(idx, 1)
    pageImage.value.forEach((v) => {
      if (v.page > pageInfo.currentPage) {
        v.page -= 1
      }
    })
  } else if (['setBottomLayer', 'setTopLayer', 'moveUpLayer', 'moveDownLayer'].includes(action)) {
    if (activeItem.value === -1) {
      return
    }
    let idx = itemTypeIndexList.value.findIndex((v) => {
      return v.index === activeItem.value
    })
    if (idx !== -1) {
      options = {}
      options.itemInfo = JSON.parse(JSON.stringify(itemTypeIndexList.value[idx]))
    }
  } else if (action === 'fullScreen') {
    options = {}
    options.dom = presentationContainer.value
  } else if (action === 'save') {
    saveOrUpdateData.value = true
  } else if (action === 'show') {
    projection.value = true
  }
  await handleToolAction(handleObj, action, options, activeItem, pageInfo)
  saveOrUpdateData.value = false
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
  setPageMap(handleObj, type, val, pageMap.value)
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
  let keyDownData = getHandleKeyDownData(event)
  handleObj.keyInput(keyDownData, {
    activeIndex: activeItem,
    itemList: itemTypeIndexList.value,
    currentPage: pageInfo.currentPage,
  })
}

const getPreRenderPage = (val) => {
  pageImage.value = val
  saveOrUpdateData.value = false
}

const getPreRenderPageRef = (val) => {
  preRender.value = val
}

watch(
  () => pageMap.value.setting.background,
  (newV, oldV) => {
    analysisBackground(newV, presentationBody.value)
  }
)

watch(itemTypeIndexList, (newV, oldV) => {
  if (
    newV.findIndex((v) => {
      return v.index === activeItem.value
    }) === -1
  ) {
    activeItem.value = -1
  }
})
watch(
  () => pageInfo.currentPage,
  (newV, oldV) => {
    changePage.value = true
    activeItem.value = -1
    nextTick(async () => {
      pageMap.value = handleObj.currentPageData
      if (handleObj.pageList.has(oldV) && handleObj.pageList.get(oldV).isEdit) {
        await generatePageImage(document.getElementById('presentation_body'), oldV, pageImage.value)
        handleObj.pageList.get(oldV).isEdit = false
      }
      itemTypeIndexList.value = handleObj.itemTypeIndexList
      nextTick(async () => {
        if (pageImage.value.findIndex((v) => v.page === newV) == -1 || handleObj.pageList.get(newV).isEdit) {
          await generatePageImage(document.getElementById('presentation_body'), newV, pageImage.value)
        }
        changePage.value = false
      })
    })
  }
)
watch(
  () => handleObj.pageList.size,
  (newV, oldV) => {
    if (newV < oldV) {
      pageMap.value = handleObj.currentPageData
    }
  }
)
</script>

<style lang="scss">
@import './container.scss';
</style>
