<template>
  <div class="file-list-menu">
    <div class="file-list-menu_path-title">文件路径:</div>
    <el-scrollbar ref="menuItemListScroll">
      <div class="menu-item-list" ref="menuItemList">
        <div class="menu-item" v-for="(item, index) of pathList" v-if="pathList.length !== 0">
          <div
            :class="index === pathList.length - 1 ? 'file-list-menu_path-active' : 'file-list-menu_path'"
            @click="jumpToPath(index)"
          >
            {{ item.name }}
          </div>
          <el-icon class="advance" v-if="index + 1 !== pathList.length"
            ><component :is="$icon['ArrowRight']"
          /></el-icon>
        </div>
        <div class="nothing-menu-item" v-else>暂未选中</div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
export default {
  name: 'FileListPath',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watchEffect, inject, nextTick } from 'vue'
import { FileMenu } from '@/plugin/image/arrangeImage/arrange'
const emit = defineEmits(['setShowFileList'])
const pathList = inject('filePath')
const menuItemList = ref()
const menuItemListScroll = ref()
watchEffect(() => {
  let length = pathList.value.length
  if (length > 0) {
    nextTick(() => {
      let children = menuItemList.value.children
      menuItemListScroll.value!.setScrollLeft(children[children.length - 1].getBoundingClientRect().x)
      menuItemListScroll.value.update();
    })
  }
})
const jumpToPath = (index: number) => {
  let emitData = []
  for (let i = 0; i <= index; i++) {
    emitData.push(pathList.value[i].value)
  }
  emit('setShowFileList', emitData)
}
</script>
<style lang="scss" scoped>
.file-list-menu {
  margin: 20px 0;
  font-size: 18px;
  height: 60px;
  border: 1px solid rgb(222, 223, 224);
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  .file-list-menu_path-title {
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
    margin-right: 5px;
  }
  .menu-item-list {
    width: auto;
    height: 40px;
    margin: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .nothing-menu-item {
      font-size: 14px;
      color: #909399;
      font-weight: 600;
      line-height: 40px;
    }
    .menu-item {
      flex: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .file-list-menu_path {
        cursor: pointer;
        color: #909399;
        font-weight: 500;
      }
      .file-list-menu_path-active {
        cursor: pointer;
        color: #409eff;
        font-weight: 800;
        text-shadow: 3px 3px 3px #e4e7ed;
      }
      .advance {
        margin: 0 8px;
        color: #909399;
      }
    }
  }
}
</style>
