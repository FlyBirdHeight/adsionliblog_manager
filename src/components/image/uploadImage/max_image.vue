<template>
  <div class="max-image-title">
    <span>最常使用</span>
  </div>
  <el-scrollbar ref="maxImageUseScroll" style="height: auto" :always="true">
    <div v-if="imageList.length != 0" class="max-image-list">
      <el-card
        v-for="(item, index) in imageList"
        shadow="hover"
        class="card"
        :body-style="{ padding: '0px', height: '100%', width: '200px' }"
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
            <div class="use">
              使用次数：<span class="use_count">{{ item.use_count }}</span>
            </div>
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
  name: 'MaxUseImage',
}
</script>
<script lang="ts" setup>
import ImageListInfo from '@/components/dialog/image/upload/info.vue'
import { ref, onMounted, provide, nextTick } from 'vue'
import { getMaxUse, Image, getDownLoadImage, downloadFile } from '@/modules/files/image'
import Clipboard from 'clipboard'
const imageList = ref<Image[]>([])
const list = ref<string[]>([])
const maxImageUseScroll = ref()
const show = ref<boolean>(false)
const checkedImageData = ref<Image>(null)
provide('showImageInfo', show)
provide('imageData', checkedImageData)
onMounted(async () => {
  imageList.value = await getMaxUse()

  list.value = imageList.value.map((v) => {
    return v.url
  })
  nextTick(() => {
    maxImageUseScroll.value.update()
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
.max-image-title {
  font-size: 1.65rem;
  margin: 5px;
  padding: 5px;
  font-weight: 600;
  color: #606266;
}
.max-image-list {
  display: flex;
  height: 320px;
  padding: 5px;
  margin: 5px;
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
      position: relative;
      height: calc(100% - 210px);
      padding: 5px;
      font-size: 15px;
      .image-name {
        color: #303133;
        font-weight: bolder;
      }
      .card-bottom {
        .use {
          font-size: 13px;
          color: #909399;
          .use_count {
            font-weight: 900;
            color: #67c23a;
          }
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
