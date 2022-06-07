<template>
  <div class="upload-image">
    <div class="upload-image_form" v-load="submitStatus">
      <div class="upload-image_form_list" id="upload-image_form_list">
        <el-upload
          :on-change="remindSetting"
          ref="uploadList"
          list-type="picture-card"
          :auto-upload="false"
          :action="'/api/file/image/upload/any'"
          :name="'file'"
          :limit="maxUploadCount"
          :on-exceed="overMaxUploadCount"
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
          <div class="status" v-for="(item, index) in percentage.entries()">
            <div class="info">
              <div class="image_name">{{ item[0] }}</div>
              <div class="image_status" :style="{ color: getUploadStatusColor(item[1].status) }">
                {{ item[1].status }}
              </div>
            </div>
            <div class="percent" v-show="Number(item[1].percentage) != 100">
              <el-progress :percentage="Number(item[1].percentage)" :format="format" :color="customColors" />
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
import { ref, reactive, provide, onMounted, defineEmits } from 'vue'
import { UploadStatus } from '@/modules/files/uploadImage'
import { handleAndUpload, PercentageList } from '@/modules/files/slice.ts'
import { getUploadStatusColor, format } from '@/plugin/image/upload/utils.ts'
import ImagePreview from '@/components/utils/image_preview.vue'
import ImageUploadInfoSet from '@/components/dialog/image/upload/set_info.vue'
const emits = defineEmits(['currentImageUpdate'])
/**
 * @property {boolean} submitStatus 提交的状态
 * @property {UploadInstance} uploadList 提交列表
 * @property {UploadStatus[]} statusList 提交状态列表
 * @property {number[]} percentage 提交进度列表
 * @property {string[]} previewList 预览显示列表
 * @property {number} previewIndex 预览显示起始位置
 * @property {boolean} extraWindow 额外窗口显示控制
 * @property {UploadFile} checkedImage 选中修改的图片
 * @property {number} maxUploadCount 最大上传数量
 */
const submitStatus = ref<boolean>(false)
const uploadList = ref<UploadInstance>()
const statusList = ref<UploadStatus[]>([])
const percentage = ref<Map<PercentageList>>(new Map())
const previewList = ref<string[]>([])
const previewIndex = ref<number>(0)
const extraWindow = reactive({
  image_preview: false,
  info_set: false,
})
const checkedImage = ref<UploadFile>(null)
const maxUploadCount = 9
provide('extraWindow', extraWindow)
provide('checkedImage', checkedImage)
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
      console.log(uploadList.value.$el.children);
  if (uploadFile.status === 'ready') {
    previewList.value.push(uploadFile.url)
    uploadFile.path = '/'
    uploadFile.directory_id = 1
    uploadFile.is_create = false
    uploadFile.isExist = false
    percentage.value.set(uploadFile.name, {
      percentage: 0,
      status: 'ready',
    })
    ElMessage({
      type: 'warning',
      message: '请设置图片保存路径',
    })
  }
  //README: 下面的操作是当达到上传限制之后，我们就把最后一个上传框给隐藏了
  if (uploadFiles.length >= maxUploadCount) {
    uploadList.value.$el.children[1].style.display = 'none'
    overMaxUploadCount()
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
  let newName =
    val.name +
    `.${checkedImage.value.raw.type.split('/')[1] == 'jpeg' ? 'jpg' : checkedImage.value.raw.type.split('/')[1]}`
  if (percentage.value.has(checkedImage.value.name)) {
    let nm = new Map()
    percentage.value.forEach((v, k) => {
      if (k === checkedImage.value.name) {
        k = newName
      }
      nm.set(k, v)
    })
    percentage.value = new Map(nm)
  }
  checkedImage.value.name = newName
  checkedImage.value.path = val.path.value
  checkedImage.value.is_create = val.path.is_create
  if (val.path.id !== null) {
    checkedImage.value.directory_id = val.path.id
  }
  handleExtraWindow(false, 'info_set')
}
/**
 * @method remove 移除图片
 * @param {UploadFile} file 上传的图片
 */
const remove = (file: UploadFile) => {
  previewList.value.splice(previewList.value.indexOf(file.url), 1)
  percentage.value.delete(file.name)
  uploadList.value.handleRemove(file)
  if (uploadList.value.uploadFiles.length < maxUploadCount) {
    uploadList.value.$el.children[1].style.display = 'inline-block'
  }
}
/**
 * @method submitImage 将图片上传到服务器上
 */
const submitImage = async () => {
  try {
    submitStatus.value = true
    const uploadFileList = []
    uploadList.value.uploadFiles.forEach((v) => {
      let uploadFile = {
        file: v.raw,
        sliceFile: [],
        name: v.name,
        is_create: v.is_create,
        directory_id: v.directory_id,
        status: v.status,
        path: v.path,
        isExist: v.isExist,
      }
      uploadFileList.push(uploadFile)
    })
    await handleAndUpload(uploadFileList, percentage.value)
    submitStatus.value = false
    ElMessage({
      type: 'success',
      message: '图片上传成功',
      grouping: true,
    })
    uploadList.value.clearFiles()
    previewList.value = []
    percentage.value.clear()
    if (uploadList.value.uploadFiles.length < maxUploadCount) {
      uploadList.value.$el.children[1].style.display = 'inline-block'
    }
    emits('currentImageUpdate', true)
  } catch (e) {
    console.log(e)
    submitStatus.value = false
  }
}
const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#6f7ad3', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#5cb87a', percentage: 100 },
]
/**
 * @method overMaxUploadCount 超过最大上传数量限制
 */
const overMaxUploadCount = () => {
  ElNotification({
    type: 'warning',
    title: '上传数量限制',
    message: `超过最大上传数量限制，最多同时上传${maxUploadCount}张！`,
    showClose: false,
    duration: 4000,
    position: 'top-right',
  })
}
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
          .image_name {
            font-size: 15px;
            font-weight: bolder;
            color: #909399;
          }
          .image_status {
            font-size: 12px;
            font-weight: bolder;
            margin-right: 20px;
          }
        }
        .percent {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
