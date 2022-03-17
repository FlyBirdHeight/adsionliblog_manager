<template>
  <el-table
    border
    ref="categoryTableMultip"
    @selection-change="handleSelectionChange"
    :data="tableData"
    style="width: 100%"
    max-height="800"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="expand">
      <template #default="props"> 123 </template>
    </el-table-column>
    <el-table-column width="150" label="名称" prop="name" />
    <el-table-column width="300" label="简介" prop="des" />
    <el-table-column width="100" label="文章数量" prop="page_count" />
    <el-table-column width="100" label="是否显示" prop="is_show">
      <template #default="props">
        <el-tag effect="dark" type="success" v-if="props.row.is_show == 1"> 显示中 </el-tag>
        <el-tag effect="dark" type="warning" v-if="props.row.is_show == 0"> 已隐藏 </el-tag>
      </template>
    </el-table-column>
    <el-table-column width="100" label="是否推荐" prop="is_recommend">
      <template #default="props">
        <el-tag effect="dark" type="success" v-if="props.row.is_recommend == 1"> 推荐中 </el-tag>
        <el-tag effect="dark" type="warning" v-if="props.row.is_recommend == 0"> 未推荐 </el-tag>
      </template>
    </el-table-column>
    <el-table-column width="150" sortable label="显示优先级" prop="sort"></el-table-column>
    <el-table-column fixed="right" label="操作" width="200">
      <template #default="props">
        <el-button-group>
          <el-button type="danger" @click="destory([props.row.id])">删除</el-button>
          <el-button type="primary" @click="update(props.row.id)">修改</el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>

  <pagination
    style="margin-top: 15px"
    :total-size="total"
    @setCurrentPage="changePageData"
    @setPageSize="changePageData"
  />
</template>
<script lang="ts">
export default {
  name: 'Category',
}
</script>
<script lang="ts" setup>
import { PaginationReturn } from '@/utils/pagination'
import { ref, reactive, onMounted, watchEffect, defineEmits, inject, watch } from 'vue'
import { CategoryList, getCategoryList } from '@/plugin/page/category_tag/category_tag'
import Pagination from '@/components/utils/pagination.vue'

const emit = defineEmits(['changeCategoryInsertStatus', 'deleteCheckedHandle'])

const categoryTableMultip = ref<InstanceType<typeof ElTable>>()
const categorySelectdValue = ref<number[]>([])
const total = ref<number>(0)
const page = ref<number>(1)
const count = ref<number>(10)
const tableData = ref<Array<CategoryList>>([])

const updateData = inject('insertCategoryStatus')
const deleteCheckedData = inject('deleteCheckedData')
/**
 * @method clearSelection 清空列表选项
 */
const clearSelection = function () {
  categoryTableMultip.value!.clearSelection()
}

const handleSelectionChange = (val: CategoryList[]) => {
  categorySelectdValue.value = []
  val.forEach((v) => {
    categorySelectdValue.value.push(v.id)
  })
}
/**
 * @description 处理列表获取
 */
const getList = function () {
  getCategoryList(page.value, count.value)
    .then((res) => {
      tableData.value = res.data
      total.value = tableData.value.length
      emit('changeCategoryInsertStatus', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
const changePageData = function (val: PaginationReturn) {
  if (val.type === 'size') {
    count.value = val.size
  } else {
    page.value = val.size
  }
}
/**
 * @description 表格按钮处理方法
 */
const destory = function (val: number[]) {
  console.log(val)
}
const update = function (id: number) {
  console.log(id)
}
//监听父组件传过来是否需要更新的
watch(updateData, (newV, oldV) => {
  if (newV) {
    getList()
  }
})
watch(deleteCheckedData, (newV, oldV) => {
  if (newV) {
    emit('deleteCheckedHandle', categorySelectdValue.value)
  } else {
    categorySelectdValue.value = []
    clearSelection();
  }
})
//这里的watchEffect监听的副作用是页数和展示数量改变的副作用
watchEffect(
  () => {
    getList()
  },
  {
    flush: 'post',
  }
)
</script>
<style lang="scss"></style>
