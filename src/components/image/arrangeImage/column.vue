<template>
  <el-cascader-panel class="file-list-column" :props="columnSetting" />
</template>
<script lang="ts">
export default {
  name: 'FileColumn',
}
</script>
<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import { MenuDataList, getMenuData } from '@/plugin/image/arrangeImage/arrange'

const list = ref<Map<string, MenuDataList>>(new Map())
list.value = new Map().set('1', {
  id: 1,
  index: '1',
  name: 'public',
  created_at: '2022-04-10',
  is_directory: true,
  is_file: false,
  icon: 'Folder',
  size: 0,
  parent_id: 0,
  getChildren: false,
  children: new Map<string, MenuDataList>(),
})
const columnSetting = {
  lazy: true,
  async lazyLoad(node, resolve) {
    let data = []
    if (node.level == 0) {
      for (let [k, v] of list.value.entries()) {
        let value = v
        value.children = []
        data.push(value)
      }
    } else if (node.data.is_directory) {
      data = await getMenuData();
    }
    resolve(data)
  },
  value: 'index',
  label: 'name',
  children: 'children',
}
</script>
<style lang="scss">
.el-cascader-menu:last-child {
  border-right: 1px solid #e4e7ed;
}
</style>
<style lang="scss" scoped>
.file-list-column {
  height: 70vh;
  width: 100%;
}
</style>
