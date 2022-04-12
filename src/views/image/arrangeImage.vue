<template>
  <file-list-header @changeShow="changeShow"></file-list-header>
  <file-list-path @setShowFileList="setShowFileList"></file-list-path>
  <file-column v-if="showType === 1" @setFilePath="setFilePath"></file-column>
  <file-list v-if="showType === 2" @setFilePath="setFilePath"></file-list>
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
  menuFileChecked.value = val;
}
const setFilePath = (val: { value: string; name: string }[]) => {
  filePath.value = val
}
</script>
<style lang="scss" scoped></style>
