<template>
  <public-table
    @changePageConfig="changePaginationConfig"
    :tableConfig="tableConfig"
    :pageConfig="paginationInfo"
    :tableData="tableData"
    :usePagination="true"
  >
    <el-table-column fixed="left" type="selection" width="55" />
    <el-table-column width="200" label="外链地址" prop="url" />
    <el-table-column fixed="right" width="150" label="操作"></el-table-column>
  </public-table>
</template>
<script lang="ts">
export default {
  name: 'FileList',
}
</script>
<script lang="ts" setup>
import PublicTable from '@/components/utils/table/table.vue'
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
</script>
<style lang="scss" scoped></style>
