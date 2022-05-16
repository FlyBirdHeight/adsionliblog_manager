<template>
  <table-kit
    @changePageConfig="changePaginationConfig"
    :tableConfig="tableConfig"
    :pageConfig="paginationInfo"
    :tableData="tableData"
    :usePagination="true"
  >
    <template #tableBody>
      <el-table-column fixed="left" type="selection" width="55" />
      <el-table-column width="200" label="外链地址" prop="url" />
      <el-table-column width="200" label="文件路径" prop="path" />
      <el-table-column width="200" label="创建时间" prop="created_at" />
      <el-table-column width="200" label="修改时间" prop="updated_at" />
      <el-table-column fixed="right" width="250" label="操作">
        <template #default="props">
          <el-button type="primary" @click="handleData('info', props.row)" size="small">查看详情</el-button>
          <el-button type="success" @click="handleData('copyLink', props.row)" size="small">复制外链</el-button>
          <el-button type="danger" @click="handleData('delete', props.row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </table-kit>
</template>
<script lang="ts">
export default {
  name: 'FileList',
}
</script>
<script lang="ts" setup>
import TableKit from '@/components/utils/table/table_kit.vue'
import { ref, computed, watch, reactive, watchEffect, onMounted } from 'vue'
import { PaginationReturn } from '@/utils/pagination'
import { PaginationConfig, TableConfig } from '@/modules/utils/table'
import { getList } from '@/plugin/image/arrangeImage/list'
const tableData = ref([])
const paginationInfo = reactive<PaginationConfig>({
  total: 0,
  page: 1,
  count: 20,
})
const tableConfig = reactive<TableConfig>({
  height: 700,
  border: true,
  size: 'small',
  showHeader: true,
  fit: false,
})
onMounted(async () => {
  let responseData = await getList({
    page: paginationInfo.page,
    count: paginationInfo.count,
    sort: {
      name: 'created_at',
      type: 'desc',
    },
  })
  tableData.value = responseData
})
/**
 * @method changePaginationConfig 修改分页数据内容
 * @param {PaginationReturn} val
 */
const changePaginationConfig = (val: PaginationReturn) => {
  if (val.type == 'size') {
    paginationInfo.count = val.size
  } else {
    paginationInfo.page = val.size
  }
}
/**
 * @method handleData 处理数据操作
 */
const handleData = (type, options) => {
  console.log(options)
  console.log(type)
}
</script>
<style lang="scss" scoped></style>
