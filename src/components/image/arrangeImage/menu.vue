<template>
  <div class="file-list-menu">
    <div class="file-list-menu_path-title">文件路径:</div>
    <div class="menu-item" v-for="(item, index) of pathList">
      <div
        :class="showPath == item.name ? 'file-list-menu_path-active' : 'file-list-menu_path'"
        @click="jumpToPath(item.id)"
      >
        {{ item.name }}
      </div>
      <el-icon class="advance" v-if="index + 1 !== pathList.length"><component :is="$icon['ArrowRight']" /></el-icon>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'FileListPath',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { FileMenu } from '@/plugin/image/arrangeImage/arrange'
const props = defineProps()
const emit = defineEmits([])

const pathList = ref<FileMenu[]>([
  { name: 'public', id: 1 },
  { name: 'image', id: 2 },
])
const showPath = ref<string>('image')

const jumpToPath = (path: 'string') => {
  console.log(path)
}
</script>
<style lang="scss" scoped>
.file-list-menu {
  margin: 20px 0;
  font-size: 18px;
  height: 50px;
  border: 1px solid rgb(222, 223, 224);
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  .file-list-menu_path-title {
      font-weight: 700;
      font-size: 1.0rem;
      margin: 0 10px 0 0;
  }
  .menu-item {
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
</style>
