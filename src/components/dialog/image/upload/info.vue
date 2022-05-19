<template>
  <dialog-show :showFooter="false" :title="title" :width="'300px'" :show="show" @closeDialog="closeDialog">
    <template #mainBody>
      <div class="image-list-info-header">
        <div class="image-list-info-header_image">
          <el-image style="width: 50px; height: 40px" :src="showIcon" fit="cover" />
        </div>
        <div class="image-list-info-header_label">
          <div class="name_size">
            <div class="label_name">
              {{ fileInfo ? fileInfo.name : '' }}
            </div>
            <div class="label_size">{{ fileInfo && fileInfo.size ? getShowSize(fileInfo.size) : '0KB' }}</div>
          </div>
          <div class="label_create_time">上传时间: {{ fileInfo ? fileInfo.created_at : '' }}</div>
        </div>
      </div>
      <div class="image-list">
        <div class="image-list_header" @click="showData.normal = !showData.normal">通用属性:</div>

        <div v-show="showData.normal" class="image-list_list">
          <div class="image-list-info_item">
            <div class="image-list-info_label">种类:</div>
            <div class="image-list-info_member">{{ fileInfo ? getFileType(fileInfo) : '' }}</div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">大小:</div>
            <div class="image-list-info_member">
              {{
                fileInfo && fileInfo.size
                  ? `${getCutSize(fileInfo.size)}字节(磁盘上的${getShowSize(fileInfo.size)})`
                  : '0字节(磁盘上的0KB)'
              }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">文件路径:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.path || fileInfo.relative_path : '' }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">外部链接:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.url : '' }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">下载次数:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.download_count : '0' }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">使用次数:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.use_count : '0' }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">上传时间:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.created_at : '' }}
            </div>
          </div>
          <div class="image-list-info_item">
            <div class="image-list-info_label">修改时间:</div>
            <div class="image-list-info_member">
              {{ fileInfo ? fileInfo.updated_at || fileInfo.created_at : '' }}
            </div>
          </div>
        </div>
      </div>
      <div class="image-list-info_name" v-load.fullscreen.lock="renameStatus" element-loading-text="正在提交">
        <div class="file-name_header" @click="showData.name = !showData.name">文件名称:</div>
        <el-popconfirm
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="是否对名称进行修改？"
          @confirm="renameSubmit"
          @cancel="cancelRename"
          :hide-icon="true"
        >
          <template #reference>
            <el-input
              size="small"
              v-show="showData.name"
              v-model="fileName"
              placeholder="文件名称"
            />
          </template>
        </el-popconfirm>
      </div>
      <div class="file-preview" v-if="fileType == 'image'">
        <div class="file-preview_header" @click="showData.preview = !showData.preview">预览:</div>
        <div v-show="showData.preview">
          <el-image
            :preview-src-list="[fileInfo.url]"
            :hide-on-click-modal="true"
            :preview-teleported="true"
            style="width: 270px; height: 200px"
            :src="fileInfo.url"
            fit="cover"
          />
        </div>
      </div>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'ImageListInfo',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, watchEffect, inject, reactive } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
import { getCutSize, getImageIcon, getShowSize } from '@/plugin/image/arrangeImage/info.ts'
import { FileType } from '@/plugin/image/arrangeImage/arrange'
import { rename } from '@/modules/files/utils.ts'

const emit = defineEmits(['closeDialog', 'changeName'])
const title = ref<string>('文件详情')
const show = inject('showImageInfo')
const fileInfo = inject('imageData')
const fileType = ref<string>('image')
const showIcon = ref<string>('')
const renameStatus = ref<boolean>(false)
const showData = reactive({
  normal: true,
  name: true,
  preview: true,
})
const fileName = ref<string>('')
const closeDialog = (val: boolean = false) => {
  emit('closeDialog', false, 'info')
}
/**
 * @method getImage 获取描述文件图片
 */
const getImage = () => {
  showIcon.value = getImageIcon(fileType.value)
}
/**
 * @method getFileType 获取文件类型
 * @param {*} fileInfo
 */
const getFileType = (fileInfo) => {
  if (fileInfo.type == FileType.IMAGE) {
    return fileInfo.name.split('.')[1] + '图像'
  } else {
    return '文章'
  }
}

/**
 * @method renameSubmit 提交修改文件/目录名称
 */
const renameSubmit = async () => {
  if (fileName.value === fileInfo.value.name.split('.')[0]) {
    ElMessage({
      type: 'success',
      grouping: true,
      message: '修改名称成功！',
    })
    return
  }
  renameStatus.value = true

  let status = await rename('file', {
    id: fileInfo.value.id,
    name: fileName.value,
    oldName: fileInfo.value.name,
  })

  if (status) {
    ElMessage({
      type: 'success',
      grouping: true,
      message: '修改名称成功！',
    })
    let oldNameList = fileInfo.value.name.split('.')
    let newName = fileName.value + '.' + oldNameList[oldNameList.length - 1]
    title.value = fileName.value
    emit('changeName', newName)
  } else {
    ElMessage({
      type: 'error',
      grouping: true,
      message: '修改名称失败！',
    })
  }
  renameStatus.value = false
}
/**
 * @method cancelRename 取消文件/目录名称修改
 */
const cancelRename = () => {
  fileName.value = fileInfo.value.name.split('.')[0]
}

watch(fileInfo, (newV, oldV) => {
  if (newV) {
    fileName.value = newV.name.split('.')[0]
    title.value = fileName.value
    if (newV.type == FileType.IMAGE) {
      fileType.value = 'image'
    } else if (newV.type == FileType.PAGE) {
      fileType.value = 'page'
    }
  }
})
watchEffect(() => {
  getImage()
})
</script>
<style lang="scss" scoped>
@mixin fileInfoBorder {
  border-top: 1px solid #e4e7ed;
  margin: 0px -15px;
  padding: 5px;
}
@mixin moduleHeader {
  cursor: pointer;
  line-height: 24px;
  font-size: 12px;
  color: #000;
  font-weight: 400;
}
.image-list-info-header {
  @include fileInfoBorder();
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .image-list-info-header_label {
    width: 100%;
    margin-left: 10px;
    .name_size {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label_name {
        font-weight: bold;
        font-size: 14px;
      }
      .label_size {
        font-weight: 500;
        font-size: 13px;
      }
    }
    .label_create_time {
      line-height: 20px;
      font-weight: lighter;
      font-size: 12px;
      color: #909399;
    }
  }
}
.image-list {
  @include fileInfoBorder();
  .image-list_header {
    @include moduleHeader();
  }
  .image-list_list {
    height: auto;
    .image-list-info_item {
      height: auto;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .image-list-info_label {
        width: 25%;
        text-align: right;
        margin-right: 10px;
        font-weight: 600;
        font-size: 14px;
        line-height: 28px;
      }
      .image-list-info_member {
        width: calc(80% - 10px);
        font-weight: 400;
        font-size: 13px;
        line-height: 28px;
        color: #303133;
      }
    }
  }
}
.image-list-info_name {
  @include fileInfoBorder();
  .file-name_header {
    @include moduleHeader();
  }
}
.file-preview {
  @include fileInfoBorder();
  .file-preview_header {
    @include moduleHeader();
  }
}
</style>
