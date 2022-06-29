<template>
  <el-scrollbar max-height="700px" style="padding: 0 10px; margin: 0 0 10px 0; user-select: none" :always="true">
    <div
      class="body-item-list_label"
      v-if="itemList.item && itemList.item.text.length != 0"
      @click="showLabel.label = !showLabel.label"
    >
      <span>文字内容：</span>
      <span style="float: right">
        <open-icon :change="showLabel.label" />
      </span>
    </div>
    <transition name="label-item-show">
      <template v-if="itemList.item && itemList.item.text.length != 0 && showLabel.label">
        <div ref="labelItemList">
          <div
            @click.stop="checkedItem(item.index)"
            class="body-item-member"
            v-for="(item, index) in itemList.item.text"
            :class="activeIndex == item.index ? 'body-item-member-active' : ''"
          >
            <div class="body-item-member_index">
              {{ index + 1 }}.
              <el-tag type="success" size="small" style="margin-left: 5px">text</el-tag>
            </div>
            <div class="body-item-member_info">
              {{ item.data }}
            </div>
            <div class="body-item-member_setting">
              <el-icon @click.stop="settingItem(item.index, 'text', 'set')"
                ><component :is="$icon['Setting']"
              /></el-icon>
              <el-tooltip content="删除" placement="top-end">
                <el-icon @click.stop="settingItem(item.index, 'text', 'delete')"
                  ><component :is="$icon['CircleClose']"
                /></el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
    </transition>

    <div
      class="body-item-list_label"
      v-if="itemList.item && itemList.item.image.length != 0"
      @click="showLabel.image = !showLabel.image"
    >
      <span>图片内容：</span>
      <span style="float: right">
        <open-icon :change="showLabel.image" />
      </span>
    </div>
    <template v-if="itemList.item && itemList.item.image.length != 0 && showLabel.image">
      <div
        @click.stop="checkedItem(item.index)"
        class="body-item-member"
        v-for="(item, index) in itemList.item.image"
        :class="activeIndex == item.index ? 'body-item-member-active' : ''"
      >
        <div class="body-item-member_index">
          {{ index + 1 }}.
          <el-tag type="success" size="small" style="margin-left: 5px">image</el-tag>
        </div>
        <div class="body-item-member_info">
          {{ item.data }}
        </div>
        <div class="body-item-member_setting">
          <el-tooltip content="设置" placement="top-start">
            <el-icon @click.stop="settingItem(item.index, 'image', 'set')"
              ><component :is="$icon['Setting']"
            /></el-icon>
          </el-tooltip>
          <el-tooltip content="删除" placement="top-end">
            <el-icon @click.stop="settingItem(item.index, 'image', 'delete')"
              ><component :is="$icon['CircleClose']"
            /></el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-scrollbar>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, inject } from 'vue'
export default {
  name: 'PresentationBodyItemList',
}
</script>
<script lang="ts" setup>
const props = defineProps()
const emit = defineEmits(['setActiveIndex'])
const itemList = inject('itemList')
const itemTypeIndexList = inject('itemTypeIndexList')
const activeIndex = inject('activeItem')
const tabInfo = inject('tabInfo')
const handleObj = inject('handleObj')
const showLabel = reactive({
  label: true,
  code: true,
  image: true,
})
const checkedItem = (index: number) => {
  activeIndex.value = index
}
const labelItemList = ref()
const settingItem = (index: number, item: string, type: string) => {
  if (type === 'delete') {
    handleObj.deleteItem(index, item)
    if (activeIndex.value === index) {
      activeIndex.value = -1
    }
    let itemIdx = itemTypeIndexList.value.findIndex((v: any) => {
      return Number(v.index) == Number(index)
    })
    itemTypeIndexList.value.splice(itemIdx, 1)
    return
  } else {
    activeIndex.value = index
    tabInfo.value = item
  }
}
</script>
<style lang="scss" scoped>
@import './item_list.scss';
</style>
