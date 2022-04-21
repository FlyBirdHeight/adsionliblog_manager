<template>
  <div class="current-image-title">
    <span>最新上传</span>
  </div>
  <el-scrollbar ref="currentImageScroll" style="height: auto" :always="true">
    <div v-if="imageList.length != 0" class="current-image-list">
      <el-card
        v-for="(item, index) in imageList"
        shadow="hover"
        class="card"
        :body-style="{ padding: '0px', height: '100%' }"
      >
        <el-image
          class="card_image"
          :src="item.url"
          :preview-src-list="list"
          :initial-index="index"
          :hide-on-click-modal="true"
          fit="cover"
        />
        <div class="card—body">
          <span class="image-name">{{ item.name }}</span>
          <div class="card-bottom">
            <div class="created_at">上传时间：{{ item.created_at }}</div>
            <div class="button-group">
              <el-button size="small" type="info" @click.stop="seeInfo(item)">详情</el-button>
              <el-button class="copyOutline" size="small" type="success" @click="copy(item.url)">外链复制</el-button>
              <el-button size="small" type="primary" @click.stop="download(item.id, item.name)">下载</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </el-scrollbar>
  <image-list-info @closeDialog="closeDialog"></image-list-info>
</template>
<script lang="ts">
export default {
  name: 'CurrentImageShow',
}
</script>
<script lang="ts" setup>
import ImageListInfo from '@/components/dialog/image/upload/info.vue'
import { ref, onMounted, nextTick, provide } from 'vue'
import { Image, getCurrent, getDownLoadImage, downloadFile } from '@/modules/files/image'
import Clipboard from 'clipboard'
const imageList = ref<Image[]>([])
const list = ref<string[]>([])
const currentImageScroll = ref()
const show = ref<boolean>(false)
const checkedImageData = ref<Image>(null)
provide('showImageInfo', show)
provide('imageData', checkedImageData)
onMounted(async () => {
  imageList.value = await getCurrent()
  list.value = imageList.value.map((v) => {
    return v.url
  })
  nextTick(() => {
    currentImageScroll.value.update()
  })
})
/**
 * @method seeInfo 查看详情
 * @param {Image} file 图片文件
 */
const seeInfo = (file: Image) => {
  checkedImageData.value = file
  show.value = true
}
const closeDialog = () => {
  show.value = false
}
/**
 * @method copy 复制外链
 * @param {string} url 外链地址
 */
const copy = (url: string) => {
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
 * @method download 下载图片
 * @param {string | number} id 图片的id
 * @param {string} name 图片名称
 */
const download = async (id: number | string, name: string) => {
  let file = await getDownLoadImage(id)
  downloadFile(file.data, name)
}
</script>
<style lang="scss" scoped>
.current-image-title {
  font-size: 1.65rem;
  margin: 5px;
  padding: 5px;
  font-weight: 600;
  color: #606266;
}
.current-image-list {
  display: flex;
  height: 320px;
  padding: 5px;
  margin: 5px;
  // border: 1px solid #ebeef5;
  .card {
    margin: 5px;
    overflow: inherit;
    width: 200px;
    .card_image {
      width: 200px;
      height: 200px;
      display: block;
    }
    .card—body {
      padding: 5px;
      font-size: 15px;
      position: relative;
      height: calc(100% - 210px);
      .image-name {
        color: #303133;
        font-weight: bolder;
      }
      .card-bottom {
        .created_at {
          font-size: 13px;
          color: #909399;
        }
        .button-group {
          position: absolute;
          bottom: 15px;
          display: flex;
          margin-top: 10px;
          justify-content: space-around;
          align-content: center;
        }
      }
    }
  }
}
</style>
