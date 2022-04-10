<template>
  <file-list-header @changeShow="changeShow"></file-list-header>
  <file-list-path></file-list-path>
  <file-column v-if="showType === 1"></file-column>
  <file-list v-if="showType === 2"></file-list>
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
import RightClickMenu from '@/components/image/arrangeImage/right_menu'
import { ref, computed, watch, reactive, watchEffect, provide } from 'vue'

const showType = ref<number>(1)
provide('showType', showType)

const changeShow = (val: number) => {
  showType.value = val
}
</script>
<style lang="scss" scoped></style>
