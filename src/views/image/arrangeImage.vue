<template>
  <file-list-header @changeShow="changeShow"></file-list-header>
  <file-list-path v-if="showType === 1" @setShowFileList="setShowFileList"></file-list-path>
  <keep-alive>
    <file-column @setShowFileList="setShowFileList" v-if="showType === 1" @setFilePath="setFilePath"></file-column>
    <file-list v-else></file-list>
  </keep-alive>
</template>
<script lang="ts">
export default {
  name: 'ArrangeImage',
}
</script>
<script lang="ts" setup>
import FileListHeader from '@/components/image/arrangeImage/header'
import FileListPath from '@/components/image/arrangeImage/menu'
import FileList from '@/components/image/arrangeImage/list'
import FileColumn from '@/components/image/arrangeImage/column'
import { ref, computed, watch, reactive, watchEffect, provide } from 'vue'

const showType = ref<number>(1)
const filePath = ref<{ value: string; name: string }[]>([])
const menuFileChecked = ref<string[]>([])
provide('showType', showType)
provide('filePath', filePath)
provide('menuFileChecked', menuFileChecked)

const changeShow = (val: number) => {
  showType.value = val
}
const setShowFileList = (val: string[]) => {
  menuFileChecked.value = val
}
const setFilePath = (val: { value: string; name: string }[]) => {
  filePath.value = val
}
</script>
<style lang="scss" scoped></style>
