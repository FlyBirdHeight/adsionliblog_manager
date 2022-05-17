<template>
  <div class="public-table">
    <base-table
      ref="table"
      :data="tableData"
      :border="tableConfig.border"
      :height="tableConfig.height"
      :size="tableConfig.size"
      :fit="tableConfig.fit"
      :show-header="tableConfig.showHeader"
      :highlight-current-row="tableConfig.highlightCurrentRow"
    >
      <el-table-column fixed="left" width="60" label="编号" type="index" :index="indexMethod" />
      <slot name="tableBody"> </slot>
    </base-table>
    <table-toolbar :showDisplay="false" @changeColumn="changeColumn" class="table-toolbar"></table-toolbar>
    <pagination
      style="margin-top: 20px"
      v-if="usePagination"
      :totalSize="pageConfig.total"
      @setCurrentPage="changePageData"
      @setPageSize="changePageData"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'TableKit',
}
</script>
<script lang="ts" setup>
import BaseTable from '@/components/utils/table.vue'
import Pagination from '@/components/utils/pagination.vue'
import TableToolbar from '@/components/utils/table/table_toolbar.vue'
import { getCurrentInstance, ref, defineProps, defineEmits, nextTick, provide } from 'vue';
import { PaginationReturn } from '../../../utils/pagination'
const props = defineProps({
  usePagination: {
    type: Boolean,
    default: true,
  },
  tableData: {
    type: Array,
    default: [],
  },
  pageConfig: {
    type: Object,
    default: {
      total: 0,
      page: 1,
      count: 10,
    },
  },
  tableConfig: {
    type: Object,
    default: {
      border: true,
      height: 600,
      size: 'medium',
      fit: false,
      showHeader: true,
      highlightCurrentRow: false,
    },
  },
})
const emit = defineEmits(['changePageConfig'])
const changePageData = (val: PaginationReturn) => {
  emit('changePageConfig', val)
}
/**
 * @method indexMethod 计算编号
 * @param {number} index 编号
 */
const indexMethod = (index: number) => {
  return (props.pageConfig.page - 1) * props.pageConfig.count + index + 1
}
const table = ref(null)
provide('table', table)
/**
 * @method changeColumn 修改列表内容
 * @param {string} type 类型
 * @param {any} options 修改参数
 */
const changeColumn = (type: string, options: any) => {
  table.value.updateColumns(new Array(...options))
}
</script>
<style lang="scss" scoped>
.public-table {
  margin-top: 50px;
  position: relative;
  .table-toolbar {
    position: absolute;
    top: -40px;
  }
}
</style>
