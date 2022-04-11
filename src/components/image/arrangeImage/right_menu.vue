<template>
  <ul
    class="right_menu_list"
    ref="rightMenuList"
    v-show="rightShow"
    :style="{ left: `${showPosition[0]}px`, top: `${showPosition[1]}px` }"
  >
    <li class="upload" @click.stop="handle('upload')">
      <el-icon><component :is="$icon['Upload']" /></el-icon>
      <span>上传文件</span>
    </li>
    <li class="delete" @click.stop="handle('delete')">
      <el-icon><component :is="$icon['Delete']" /></el-icon>
      <span>删除文件</span>
    </li>
    <li class="info" @click.stop="handle('info')">
      <el-icon><component :is="$icon['More']" /></el-icon>
      <span>查看详情</span>
    </li>
    <li class="download" @click.stop="handle('download')">
      <el-icon><component :is="$icon['Download']" /></el-icon>
      <span>下载文件</span>
    </li>
  </ul>
</template>
<script lang="ts">
export default {
  name: 'RightClickMenu',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, watchEffect, inject, onMounted } from 'vue'
import { HANDLEFILE } from '@/plugin/image/arrangeImage/handle'
const props = defineProps()
const emit = defineEmits(['closeRightList'])
const rightShow = inject('showRight')
const rightData = inject('rightClickData')
const showPosition = inject('showPosition')
const rightMenuList = ref()
const displayRight = () =>
  document.addEventListener('click', (e) => {
    if (e.target.className !== 'right_menu_list') {
      emit('closeRightList')
    }
    document.removeEventListener('click', this, true)
  })
onMounted(() => {
  displayRight()
})
const handle = (type: string) => {
  console.log(rightData)
  switch (type) {
    case HANDLEFILE.UPLOAD_FILE:
      console.log(type)
      break
    case HANDLEFILE.DOWNLOAD_FILE:
      console.log(type)
      break
    case HANDLEFILE.DELETE_FILE:
      console.log(type)
      break
    case HANDLEFILE.SEE_INFO:
      console.log(type)
      break
  }
  emit('closeRightList')
}
</script>
<style lang="scss" scoped>
ul {
  position: fixed;
  bottom: 150px;
  right: 150px;
  width: 170px;
  height: 190px;
  list-style: none;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding-inline: initial;
  margin-block: revert;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  z-index: 9999;
  li {
    width: 150px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    height: 35px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 10px;
  }
  li.upload {
    color: #e6a23c;
    font-weight: 500;
  }
  li.delete {
    color: #f56c6c;
    font-weight: 500;
  }
  li.download {
    color: #67c23a;
    font-weight: 500;
  }
  li.info {
    color: #409eff;
    font-weight: 500;
  }
  li:hover {
    border-radius: 10px;
    background-color: #409eff;
    color: #ffffff;
    font-weight: bolder;
    cursor: pointer;
    box-shadow: 0px 0px 12px rgb(0 0 0 / 12%);
  }
}
</style>
