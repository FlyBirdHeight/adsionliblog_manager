<template>
  <dialog-show :title="title" :width="'400px'" :show="show.info_set" @closeDialog="closeDialog">
    <template #mainBody>
      <el-form
        status-icon
        :rules="submitRule"
        ref="imageInfo"
        :model="formData"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="文件名称:" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="文件路径:" prop="path">
          <el-autocomplete
            style="width: 100%"
            :fetch-suggestions="getFullPath"
            @select="handleSelect"
            @change="changePath"
            v-model="formData.path.value"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
    </template>
    <template #foot>
      <el-button size="small" type="primary" @click="submitForm">确认修改</el-button>
      <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'ImageUploadInfoSet',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, inject, onMounted } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
import { setInfoReg, getFindPath, judgeNewPath } from '@/plugin/image/upload/vaildate.ts'
import { getFilePath } from '@/plugin/image/upload/requestData.ts'
const emit = defineEmits(['closeDialog', 'submitImageSetting'])
/**
 * @property {*} show 显示控制
 * @property {*} checkedImage 选中图片信息
 * @property {{name: string, path:string, createDirectory: boolean}} formData 表单数据
 * @property {*} imageInfo form的vnode节点
 * @property {string[]} pathList路径表单
 * @property {*} submitRule 提交表单效验
 */
const show = inject('extraWindow')
const checkedImage = inject('checkedImage')
const formData = reactive({
  name: '',
  path: {
    value: '',
    id: null,
    is_create: false,
  },
})
const imageInfo = ref<FormInstance>()
const pathList = ref<{ value: string }[]>([])
const submitRule = reactive(setInfoReg)
onMounted(async () => {
  pathList.value = await getFilePath()
})

const title = '图片信息设置'

/**
 * @method getFullPath 获取完整的保存路径
 */
const getFullPath = (queryString: string, cb: (arg: any) => void) => {
  const results = getFindPath(queryString, pathList.value)

  cb(results)
}
/**
 * @method handleSelect 处理远程搜索点击事件
 */
const handleSelect = (item: { id: number; name: string }) => {
  formData.path.id = item.id
  formData.path.is_create = false
}
/**
 * @method changePath 改变路径时触发
 * @param {string | number} value 输入的路径值
 */
const changePath = (value: string | number) => {
  if (getFindPath(value, pathList.value).length == 0) {
    formData.path.id = null
    formData.path.is_create = true
  }
}
/**
 * @method submitForm 提交表单数据，同时进行效验
 */
const submitForm = () => {
  if (!imageInfo.value) {
    return
  }
  let newPath = judgeNewPath(formData.path.name, pathList.value)
  if (!newPath.status) {
    formData.path.id = newPath.id
    formData.path.is_create = false
  } else {
    formData.path.id = null
    formData.path.is_create = true
    ElMessage({
      type: 'warning',
      message: '当前路径不存在，将会在上传时创建本图片指定路径！',
    })
  }
  try {
    imageInfo.value.validate((valid) => {
      if (valid) {
        emit('submitImageSetting', formData)
      } else {
        return false
      }
    })
  } catch (e) {
    console.log(e)
  }
}
const closeDialog = () => {
  emit('closeDialog', false, 'info_set')
}
/**
 * @description 监听checkedImage内容变化，修改其名称和路径
 */
watch(checkedImage, (newV, oldV) => {
  if (newV) {
    formData.name = newV.name.split('.')[0]
    formData.path.value = newV.path
  }
})
</script>
<style lang="scss" scoped></style>
