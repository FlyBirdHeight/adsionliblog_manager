<template>
  <dialog-show
    :modal="false"
    :draggable="true"
    :showFooter="true"
    :title="title"
    :width="'400px'"
    :show="props.show"
    :toBody="false"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <el-form class="avatar-uploader" :model="formData" label-position="top">
        <el-form-item label="外链地址:" v-if="props.type === 'linkPath'">
          <el-input v-model="formData.path"></el-input>
        </el-form-item>
        <el-upload
          v-else
          style="text-align: center"
          :action="'#'"
          list-type="picture-card"
          :on-change="settingImage"
          ref="uploadImage"
          :auto-upload="false"
          :name="'file'"
          :limit="1"
        >
          <el-icon><component :is="$icon['Plus']" /></el-icon>
          <template #file="{ file }">
            <div>
              <el-image style="width: 146px; height: 146px" :src="file.url" :fit="'cover'" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="preview(file)">
                  <el-icon><component :is="$icon['ZoomIn']" /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="remove(file)">
                  <el-icon><component :is="$icon['Delete']" /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </el-form>
    </template>
    <template #foot>
      <div class="edit-solution-footer">
        <el-button @click="submitImage" type="primary">确认使用</el-button>
        <el-button @click="closeDialog" type="info">取消</el-button>
      </div>
    </template>
  </dialog-show>
  <image-preview :previewList="previewList" :previewIndex="0" :showPreview="showPreview" @closePreview="closePreview" />
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, reactive, onUnmounted, watch } from 'vue'
import { handleAndUpload, UploadFile } from '@/modules/files/slice.ts'
export default {
  name: 'EditBodyImageSetting',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import ImagePreview from '@/components/utils/image_preview.vue'
import { getDirectoryInfo } from '@/modules/files/utils'
const props = defineProps<{
  type: 'linkPath'
  show: false
  savePath: '/images/person-presentation/background-image'
}>()
const emit = defineEmits(['closeDialog', 'setImagePath'])
const showPreview = ref<boolean>(false)
const uploadImage = ref()
const previewList = ref([])
const formData = reactive({
  path: '',
  image: null,
})
const title = computed(() => {
  if (props.type === 'linkPath') {
    return '外链设置'
  } else {
    return '图片上传'
  }
})

const settingImage = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  formData.image = uploadFile
  previewList.value[0] = formData.image.url
  if (uploadFiles.length >= 1) {
    uploadImage.value.$el.children[1].style.display = 'none'
  }
}
const preview = (file: UploadFile) => {
  showPreview.value = true
}
const closePreview = () => {
  showPreview.value = false
}
/**
 * @method remove 移除图片
 * @param {UploadFile} file 上传的图片
 */
const remove = (file: UploadFile) => {
  if (!uploadImage.value || !file) {
    return
  }
  uploadImage.value.handleRemove(file)
  if (uploadImage.value.uploadFiles.length < 1) {
    setTimeout(() => {
      uploadImage.value.$el.children[1].style.display = 'inline-block'
    }, 500)
  }
  previewList.value = []
}
const submitImage = async () => {
  if (props.type === 'linkPath') {
    emit('setImagePath', formData.path)
    formData.path = ''
    emit('closeDialog')
  } else {
    const directoryInfo = await getDirectoryInfo({
      select: 'id',
      where: {
        relative_path: '/file/link' + props.savePath,
      },
    })
    const directoryId = directoryInfo[0].id

    let uploadFile = {
      file: formData.image.raw,
      name: formData.image.name,
      sliceFile: [],
      path: props.savePath,
      isExist: false,
      is_create: false,
      directory_id: directoryId,
      status: 'ready',
    }
    let data = await handleAndUpload([uploadFile], null)
    emit('setImagePath', data[0])
    ElMessage({
      type: 'success',
      message: '图片上传成功',
      grouping: true,
    })
    remove(formData.image)
    previewList.value = []
    formData.image = null
    emit('closeDialog')
  }
}
const closeDialog = () => {
  emit('closeDialog', false)
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
</style>
