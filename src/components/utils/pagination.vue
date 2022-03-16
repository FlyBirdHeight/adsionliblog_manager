<template>
  <el-pagination
    style="justify-content: center"
    v-model:currentPage="page"
    v-model:page-size="size"
    :page-sizes="pageList"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalPage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'

const props = defineProps<{
  totalSize: number
  pageSizes?: number[]
}>()
const emit = defineEmits(['setCurrentPage', 'setPageSize'])

const page = ref<number>(1)
const pageList = ref<number[]>([10, 20, 30, 40])
const totalPage = ref<number>(0)
const size = ref<number>(pageList.value[0])

const total = computed(() => {
  return props.totalSize
})
const pageSize = computed(() => {
  return props.pageSizes
})
watch(total, (newV, oldV) => {
  totalPage.value = newV
})
watch(pageSize, (newV, oldV) => {
  pageList = newV
})
const handleSizeChange = function (val: number) {
  emit('setPageSize', {
    type: 'size',
    size: size.value,
  })
}
const handleCurrentChange = function (val: number) {
  emit('setCurrentPage', {
    type: 'page',
    size: page.value,
  })
}
</script>
<style lang="scss"></style>
