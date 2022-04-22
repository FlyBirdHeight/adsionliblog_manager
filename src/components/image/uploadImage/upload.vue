<template>
  <div class="upload-image">
    <div class="upload-image_form">
      <div class="upload-image_form_list">
        <el-upload
          :on-change="remindSetting"
          ref="uploadList"
          list-type="picture-card"
          :auto-upload="false"
          :on-progress="getUploadProgress"
          :action="'/api/file/image/upload/any'"
          :before-upload="beforeUpload"
          :name="'file'"
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
          <div class="status" v-for="item in 1">
            <div class="info">
              <div class="image_name">adsionli.jpeg</div>
              <div class="image_status" style="margin-right: 15px">123</div>
            </div>
            <div class="percent" v-show="percentage[0] != 100">
              <el-progress :percentage="percentage[0]" :format="format" :color="customColors" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <image-preview
    :previewList="previewList"
    :previewIndex="previewIndex"
    :showPreview="extraWindow.image_preview"
    @closePreview="handleExtraWindow"
  />
  <image-upload-info-set @closeDialog="handleExtraWindow" @submitImageSetting="setImageInfo"></image-upload-info-set>
</template>
<script lang="ts">
export default {
  name: 'UploadImageForm',
}
</script>
<script lang="ts" setup>
import { ref, reactive, provide, onMounted } from 'vue'
import { UploadStatus } from '@/modules/files/uploadImage'
import { uploadAny } from '@/modules/files/upload.ts'
import ImagePreview from '@/components/utils/image_preview.vue'
import ImageUploadInfoSet from '@/components/dialog/image/upload/set_info.vue'
/**
 * @property {boolean} submitStatus 提交的状态
 * @property {UploadInstance} uploadList 提交列表
 * @property {UploadStatus[]} statusList 提交状态列表
 * @property {number[]} percentage 提交进度列表
 * @property {string[]} previewList 预览显示列表
 * @property {number} previewIndex 预览显示起始位置
 * @property {boolean} extraWindow 额外窗口显示控制
 * @property {UploadFile} checkedImage 选中修改的图片
 */
const submitStatus = ref<boolean>(false)
const uploadList = ref<UploadInstance>()
const statusList = ref<UploadStatus[]>([])
const percentage = ref<number[]>([50])
const previewList = ref<string[]>([])
const previewIndex = ref<number>(0)
const extraWindow = reactive({
  image_preview: false,
  info_set: false,
})
const checkedImage = ref<UploadFile>(null)
provide('extraWindow', extraWindow)
provide('checkedImage', checkedImage)
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
  previewIndex.value = previewList.value.indexOf(file.url)
  handleExtraWindow(true, 'image_preview')
}
/**
 * @method handleExtraWindow 关闭额外的窗口显示
 * @param {boolean} val 显隐控制
 * @param {string} type 显隐控制类型
 */
const handleExtraWindow = (val: boolean, type: string) => {
  extraWindow[type] = val
}
/**
 * @method remindSetting 提醒设置图片路径
 */
const remindSetting = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile.status === 'ready') {
    previewList.value.push(uploadFile.url)
    uploadFile.path = '/'
    uploadFile.directory_id = 1
    ElMessage({
      type: 'warning',
      message: '请设置图片保存路径',
    })
  }
}
/**
 * @method setting 设置图片信息
 * @param {UploadFile} file 选中的数据
 */
const setting = (file: UploadFile) => {
  checkedImage.value = file
  handleExtraWindow(true, 'info_set')
}
/**
 * @method setImageInfo 设置图片信息内容，通过组件回调
 * @param {*} val 回调数值
 */
const setImageInfo = (val: { name: string; path: { value: string; id: number | null; is_create: boolean } }) => {
  checkedImage.value.name = val.name
  checkedImage.value.path = val.path.value
  checkedImage.value.is_create = val.path.is_create
  if (val.path.id !== null) {
    checkedImage.value.directory_id = val.path.id
  }
  handleExtraWindow(false, 'info_set')
}
/**
 * @method remove 移除图片
 */
const remove = (file: UploadFile) => {
  previewList.value.splice(previewList.value.indexOf(file.url), 1)
  uploadList.value.handleRemove(file)
}
const beforeUpload = (rawFile: UploadRawFile) => {
  console.log(rawFile)
  console.log(uploadList.value)
}
/**
 * @method submitImage 将图片上传到服务器上
 */
const submitImage = () => {
  submitStatus.value = true
  console.log(uploadList.value);
  
  uploadAny(uploadList.value.uploadFiles)
  // uploadList.value.submit()
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
