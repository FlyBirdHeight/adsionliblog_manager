<template>
  <dialog-show
    :showFooter="true"
    :title="title"
    :width="'300px'"
    :show="show.createDirectory"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <div class="arrange-image-create_directory">
        <el-input
          v-model="fileName"
          placeholder="请输入文件夹名称"
          maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </div>
    </template>
    <template #foot>
      <el-button size="small" type="primary" @click="submitForm">创建</el-button>
      <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'CreateDirectory',
}
</script>
<script lang="ts" setup>
import { ref, defineEmits, watch, reactive, inject } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
import { verifyHasDirectory } from '../../../../modules/files/utils'
const emit = defineEmits(['closeDialog'])
const show = inject('fileDialog')
const title = '新建文件夹'
const parentData = inject('rightClickData')
const fileName = ref<string>('新建文件夹')
const submitForm = async () => {
  fileName.value = fileName.value.replace(/\s*/g, '')
  if (fileName.value == '') {
    ElMessage({
      type: 'error',
      grouping: true,
      message: '文件夹名称不可为空',
    })
    return
  }
  let isExist = await verifyHasDirectory(parentData.value.id, fileName.value)
  if (isExist) {
    ElMessage({
      type: 'error',
      grouping: true,
      message: '当前目录下存在同名文件夹，请修改名称',
    })
    fileName.value = ''
    return
  }
}
const closeDialog = (val: boolean = false) => {
  emit('closeDialog', false, 'createDirectory')
}
</script>
<style lang="scss" scoped></style>
