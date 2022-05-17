<template>
  <table-kit
    @changePageConfig="changePaginationConfig"
    :tableConfig="tableConfig"
    :pageConfig="paginationInfo"
    :tableData="tableData"
    :usePagination="true"
  >
    <template #tableBody>
      <!-- <el-table-column fixed="left" type="selection" width="55" /> -->
      <el-table-column width="150" label="名称" prop="name" />
      <el-table-column width="200" label="外链地址" prop="url" />
      <el-table-column width="200" label="文件路径" prop="path" />
      <el-table-column width="150" label="文件大小" prop="size">
        <template #default="props">
          <el-tag>{{ getShowSize(props.row.size) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200" label="创建时间" prop="created_at" />
      <el-table-column width="200" label="修改时间" prop="updated_at" />
      <el-table-column fixed="right" width="300" label="操作">
        <template #default="props">
          <el-button type="primary" @click="handleData('info', props.row)" size="small">查看详情</el-button>
          <el-button class="copyOutline" type="success" @click="handleData('copyLink', props.row)" size="small"
            >复制外链</el-button
          >
          <el-button @click="handleData('download', props.row)" size="small">下载</el-button>
          <el-button type="danger" @click="handleData('delete', props.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </table-kit>
  <image-list-info @closeDialog="closeDialog" @changeName="changeName"></image-list-info>
</template>
<script lang="ts">
export default {
  name: 'FileList',
}
</script>
<script lang="ts" setup>
import TableKit from '@/components/utils/table/table_kit.vue'
import { ref, computed, watch, reactive, watchEffect, onMounted, provide } from 'vue'
import { PaginationReturn } from '@/utils/pagination'
import { PaginationConfig, TableConfig } from '@/modules/utils/table'
import { getList } from '@/plugin/image/arrangeImage/list'
import { getShowSize } from '@/plugin/image/arrangeImage/info.ts'
import Clipboard from 'clipboard'
import ImageListInfo from '@/components/dialog/image/upload/info.vue'
import { Image, getDownLoadImage, downloadFile } from '../../../modules/files/image'
import { deleteData } from '../../../modules/files/utils'

const tableData = ref([])
const paginationInfo = reactive<PaginationConfig>({
  total: 0,
  page: 1,
  count: 10,
})
const tableConfig = reactive<TableConfig>({
  height: 800,
  border: true,
  size: 'small',
  showHeader: true,
  fit: false,
})
const getListData = async () => {
  let responseData = await getList(
    {
      page: paginationInfo.page,
      count: paginationInfo.count,
      sort: {
        name: 'created_at',
        type: 'desc',
      },
    },
    true
  )
  tableData.value = responseData.data
  paginationInfo.total = responseData.total
}
onMounted(async () => {
  await getListData()
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
watchEffect(
  () => {
    getListData()
  },
  {
    flush: 'post',
  }
)
/**
 * @method handleData 处理数据操作
 */
const handleData = async (type, options) => {
  switch (type) {
    case 'delete':
      await deleteFile(options.id)
      break
    case 'copyLink':
      copyLink(options.url)
      break
    case 'info':
      show.value = true
      checkedImageData.value = options
      break;
    case 'download':
      let file = await getDownLoadImage(options.id)
      downloadFile(file.data, options.name)
      break
    default:
      break
  }
}
const deleteFile = async (id: number) => {
  let responseData = await deleteData('file', id)
  if (responseData.status) {
    ElMessage({
      type: 'success',
      message: '文件删除成功！',
      grouping: true,
    })
    getListData();
  }
}

const copyLink = (url: string) => {
  let clipboard = new Clipboard('.copyOutline', {
    text: () => {
      return url
    },
  })
  clipboard.on('success', function (e) {
    ElMessage.success('图片外链复制成功，请使用Ctrl+V进行使用！')
    clipboard.destroy()
  })
  clipboard.on('error', function (e) {
    ElMessage.error('当前不支持复制到剪切板！')
    clipboard.destroy()
  })
}
/**
 * @module 下面这个模块专门处理查看详情的相关内容
 */
const show = ref<boolean>(false)
const checkedImageData = ref<Image>(null)
provide('showImageInfo', show)
provide('imageData', checkedImageData)
const closeDialog = () => {
  show.value = false
}
const changeName = (val: string) => {
  checkedImageData.value.name = val
}
</script>
<style lang="scss" scoped></style>
