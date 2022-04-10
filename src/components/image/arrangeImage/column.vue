<template>
  <el-cascader-panel :options="options" :props="columnSetting" />
</template>
<script lang="ts">
export default {
  name: 'FileColumn',
}
</script>
<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import { getFileList, MenuDataList } from '@/plugin/image/arrangeImage/arrange'

const list = ref<MenuDataList[]>([])
const columnSetting = {
    lazy: true,
    lazyLoad(node) {

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
<style lang="scss" scoped></style>
