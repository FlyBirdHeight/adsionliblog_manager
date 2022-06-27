<template>
  <div class="editTool">
    <div class="editTool-header">
      <el-scrollbar :always="true" :min-size="5">
        <div style="display: flex">
          <div
            :class="activeInfo == item.value ? 'editTool-header-tab_active' : ''"
            class="editTool-header-tab"
            @click="activeInfo = item.value"
            v-for="item in tabList"
            v-show="item.show"
          >
            {{ item.label }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="editTool-body">
      <keep-alive>
        <presentation-body-setting
          v-if="activeInfo === 'main'"
          @setBackground="setBackground"
          @editBackground="editBackground"
          @removeBackgroundImage="removeBackgroundImage"
        ></presentation-body-setting>
        <edit-presentation-text v-else-if="activeInfo == 'text'" />
        <edit-presentation-image v-else-if="activeInfo == 'image'" />
      </keep-alive>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineEmits, computed, watch, reactive, watchEffect, inject, provide } from 'vue'
export default {
  name: 'PresentationEditTool',
}
</script>
<script lang="ts" setup>
import PresentationBodySetting from '@/components/site/person/presentation/edit/body/body.vue'
import EditPresentationText from '@/components/site/person/presentation/edit/text/edit_text.vue'
import EditPresentationImage from '@/components/site/person/presentation/edit/image/edit_image.vue'
const emit = defineEmits(['setPage'])
const tabList = ref([
  {
    label: '绘板设置',
    value: 'main',
    show: true,
  },
  {
    label: '文字设置',
    value: 'text',
    show: false,
  },
  {
    label: '图片设置',
    value: 'image',
    show: false,
  },
  {
    label: '链接设置',
    value: 'link',
    show: false,
  },
  {
    label: '动画设置',
    value: 'animate',
    show: false,
  },
])
const activeInfo = ref<string>('main')
const itemTypeIndexList = inject('itemTypeIndexList')
const activeIndex = inject('activeItem')
provide('tabInfo', activeInfo)
//NOTE: 这些都是设置绘板的内容
const setBackground = (val: string, defaultSetting: any) => {
  emit('setPage', { val, defaultSetting }, 'background')
}
const editBackground = (val: any) => {
  emit('setPage', val, 'backgroundEdit')
}
const removeBackgroundImage = (val: any) => {
  emit('setPage', { val }, 'removeBackgroundImage')
}
const displayTab = () => {
  tabList.value.forEach((v) => {
    if (v.value != 'main') {
      v.show = false
    }
  })
}
watch(activeIndex, (newV, oldV) => {
  displayTab()
  if (newV === -1) {
    activeInfo.value = 'main'
    return
  }
  let index = itemTypeIndexList.value.findIndex((v) => v.index === newV)

  if (index == -1) {
    activeInfo.value = 'main'
    return
  }
  let tI = tabList.value.findIndex((v) => v.value === itemTypeIndexList.value[index].type)
  if (tI == -1) {
    activeInfo.value = 'main'
    return
  }
  tabList.value[tI].show = true
  activeInfo.value = itemTypeIndexList.value[index].type
})
</script>
<style lang="scss" scoped>
.editTool {
  height: 100%;
  padding: 5px;
  .editTool-header {
    height: 45px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto;
    user-select: none;
    .editTool-header-tab {
      padding: 0 5px;
      width: 80px;
      border: 1px solid #dcdfe6;
      flex-shrink: 0;
      margin-right: -1px;
      border-bottom: none;
      border-top: none;
      height: 45px;
      line-height: 40px;
      font-size: 13px;
      color: #606266;
      text-align: center;
      cursor: pointer;
    }
    .editTool-header-tab_active {
      background-color: #409eff;
      color: #fff;
      font-size: bolder;
    }
  }
  .editTool-body {
    height: auto;
  }
}
</style>
