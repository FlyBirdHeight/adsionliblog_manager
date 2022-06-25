<template>
  <dialog-show :title="title" :width="'400px'" :show="show.upload" @closeDialog="closeDialog">
    <template #mainBody>
      <div class="arrange-image-upload">
        <el-upload
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
            <div class="upload-container">
              <el-image
                v-if="/image/.test(file.raw.type)"
                style="width: 146px; height: 146px"
                :src="file.url"
                :fit="'cover'"
              />
              <div v-else class="not-image-file">
                {{ file.name }}
              </div>
              <span class="el-upload-list__item-actions">
                <span v-if="/image/.test(file.raw.type)" class="el-upload-list__item-preview" @click="preview(file)">
                  <el-icon><component :is="$icon['ZoomIn']" /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="remove(file)">
                  <el-icon><component :is="$icon['Delete']" /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </div>
    </template>
    <template #foot>
      <el-button size="small" type="primary" @click="submitForm">上传</el-button>
      <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
  <image-preview :previewList="previewList" :previewIndex="0" :showPreview="showPreview" @closePreview="closePreview" />
</template>
<script lang="ts">
import { ref, inject, defineProps, defineEmits, computed, watch, provide, watchEffect, nextTick } from 'vue'
import { handleAndUpload } from '@/modules/files/slice'
export default {
  name: 'ArrangeImageUpload',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import ImagePreview from '@/components/utils/image_preview.vue'

const emit = defineEmits(['closeDialog'])
const show = inject('fileDialog')
const fileInfo = inject('rightClickData')
const title = '文件上传'
const submit = ref<boolean>(false)

const uploadImage = ref()
const showPreview = ref<boolean>(false)
const uploadImageData = ref(null)
const previewList = ref([])
provide('submitUpload', submit)
const settingImage = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  uploadImageData.value = uploadFile
  previewList.value[0] = uploadFile.url
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
  uploadImage.value.handleRemove(file)
  if (uploadImage.value.uploadFiles.length < 1) {
    nextTick(() => {
      setTimeout(() => {
        uploadImage.value.$el.children[1].style.display = 'inline-block'
      }, 500)
    })
  }
  uploadImageData.value = null
  previewList.value = []
}
const closeDialog = (val: boolean = false) => {
  remove(uploadImageData.value)
  emit('closeDialog', false, 'upload')
}
const submitForm = async () => {
  if (fileInfo.value.type !== 'directory') {
    return
  }
  let uploadFile = {
    file: uploadImageData.raw,
    name: uploadImageData.name,
    sliceFile: [],
    path: fileInfo.value.relative_path,
    isExist: false,
    is_create: false,
    directory_id: fileInfo.value.id,
    status: 'ready',
  }
  let data = await handleAndUpload([uploadFile], null)
  submit.value = true
}
</script>
<style lang="scss" scoped>
.el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.upload-container {
  height: 100%;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  .not-image-file {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-y: hidden;
  }
}
</style>
