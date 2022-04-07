<template>
  <div class="max-image-title">
    <span>最常使用</span>
  </div>
  <el-scrollbar style="height: auto" :always="true">
    <div class="max-image-list">
      <el-card
        v-for="(item, index) in 8"
        shadow="hover"
        class="card"
        :body-style="{ padding: '0px', height: '100%', width: '200px' }"
      >
        <el-image class="card_image" :src="list[index]" :preview-src-list="list" :initial-index="index" fit="cover" />
        <div class="card—body">
          <span class="image-name">汉堡包</span>
          <div class="card-bottom">
            <div class="use">下载次数：<span class="use_count">100</span></div>
            <div class="button-group">
              <el-button size="small" type="info">详情</el-button>
              <el-button size="small" type="success">外链复制</el-button>
              <el-button size="small" type="primary">下载</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
export default {
  name: 'MaxUseImage',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { ImageList, getMaxUse } from '@/modules/files/image'
const props = defineProps()
const emit = defineEmits([])

const imageList = ref<ImageList[]>([])
const list = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
  'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
]
const size = ref<number>(8)
const getList = async () => {
  try {
    let returnData = await getMaxUse(size.value)
    if (returnData.data.length != 0) {
      imageList.value = returnData
    }
  } catch (e) {
    console.log(e)
  }
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
