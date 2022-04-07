<template>
  <div class="upload-image">
    <div class="upload-image_form">
      <div class="upload-image_form_list">
        <el-upload
          :on-change="remindSetting"
          ref="uploadList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :action="'/api/file/image/upload'"
          :on-progress="getUploadProgress"
        >
          <el-icon><component :is="$icon['Plus']" /></el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="preview(file)">
                  <el-icon><component :is="$icon['ZoomIn']" /></el-icon>
                </span>
                <span class="el-upload-list__item-preview" @click="setting(file)">
                  <el-icon><component :is="$icon['Setting']" /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="remove(file)">
                  <el-icon><component :is="$icon['Delete']" /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </div>
      <div class="upload-image_form_bottom">
        <el-button style="margin-right: 10px" :loading="submitStatus" type="success" size="small" @click="submitImage"
          >上传服务器</el-button
        >
      </div>
    </div>
    <div class="upload-image_list">
      <div class="header">上传状态列表:</div>
      <el-scrollbar max-height="calc(100% - 41px)" :always="true">
        <div class="body">
          <div class="status" v-for="item in 20">
            <div class="info">
              <div class="image_name">adsionli.jpeg</div>
              <div class="image_status" style="margin-right:15px">
                123
              </div>
            </div>
            <div class="percent" v-show="percentage[0] != 100">
              <el-progress :percentage="percentage[0]" :format="format" :color="customColors" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'UploadImageForm',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { UploadStatus } from '../../../modules/files/uploadImage'
const props = defineProps()
const emit = defineEmits([])

const submitStatus = ref<boolean>(false)
const uploadList = ref<UploadInstance>()
const statusList = ref<UploadStatus[]>([])
const percentage = ref<number[]>([50])
/**
 * @method getUploadProgress 获取上传文件进度信息
 */
const getUploadProgress = (evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(e.percent)
}
/**
 * @method preview 预览图片信息
 */
const preview = (file: UploadFile) => {
  console.log(file)
  console.log(uploadList.value.uploadFiles.length)
}
/**
 * @method remindSetting 提醒设置图片路径
 */
const remindSetting = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile.status === 'ready') {
    ElMessage({
      type: 'warning',
      message: '请设置图片保存路径',
    })
  }
}
/**
 * @method setting 设置图片信息
 */
const setting = (file: UploadFile) => {
  console.log(file)
  file.path = '/image/js'
}
/**
 * @method remove 移除图片
 */
const remove = (file: UploadFile) => {
  console.log(file)
  console.log(uploadList.value)
  uploadList.value.handleRemove(file)
  console.log(uploadList.value.uploadFiles.length)
}
/**
 * @method submitImage 将图片上传到服务器上
 */
const submitImage = () => {
  submitStatus.value = true
  console.log(uploadList.value.uploadFiles)
  setTimeout(() => {
    submitStatus.value = false
    ElMessage({
      type: 'success',
      message: '图片上传成功',
    })
  }, 1000)
}
/**
 * @method format 获取进度条
 */
const format = (percentage) => (percentage === 100 ? '上传成功' : `${percentage}%`)
const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#6f7ad3', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#5cb87a', percentage: 100 },
]
</script>
<style lang="scss" scoped>
@mixin uploadHeight {
  @media screen and (min-width: 900px) {
    height: 450px;
    width: calc(50% - 10px);
  }
  @media screen and (max-width: 900px) {
    height: 350px;
    width: 100%;
    margin-top: 5px;
  }
  @media screen and (max-width: 500px) {
    height: 300px;
    width: 100%;
    margin-top: 5px;
  }
  border: 1px solid #ebeef5;
  margin: 0 3px;
}
.upload-image {
  display: flex;
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  .upload-image_form {
    @include uploadHeight();
    position: relative;
    .upload-image_form_list {
      padding: 5px;
      height: 88%;
      overflow: auto;
    }
    .upload-image_form_bottom {
      height: calc(12% - 10px);
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid #ebeef5;
    }
  }
  .upload-image_list {
    @include uploadHeight();
    .header {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ebeef5;
      font-size: 18px;
      padding: 0 15px;
      font-weight: 800;
    }
    .body {
      height: calc(100% - 41px);
      padding: 5px;
      .status {
        margin-top: 10px;
        border: 1px solid #ebeef5;
        padding: 5px;
        border-radius: 5px;
        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
