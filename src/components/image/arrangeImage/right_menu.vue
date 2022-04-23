<template>
  <ul
    class="right_menu_list"
    ref="rightMenuList"
    v-show="rightShow"
    :style="{ left: `${showPosition[0]}px`, top: `${showPosition[1]}px` }"
  >
    <li class="upload" v-show="rightData && rightData.is_directory" @click.stop="handle('upload')">
      <el-icon><component :is="$icon['Upload']" /></el-icon>
      <span>上传文件</span>
    </li>
    <li class="download" v-show="rightData && rightData.is_file" @click.stop="handle('download')">
      <el-icon><component :is="$icon['Download']" /></el-icon>
      <span>下载文件</span>
    </li>
    <li class="info" @click.stop="handle('info')">
      <el-icon><component :is="$icon['More']" /></el-icon>
      <span>查看详情</span>
    </li>
    <li class="create-directory" v-show="rightData && rightData.is_directory" @click.stop="handle('directory')">
      <el-icon><component :is="$icon['FolderAdd']" /></el-icon>
      <span>创建文件夹</span>
    </li>
    <li class="delete" @click.stop="handle('delete')">
      <el-icon><component :is="$icon['Delete']" /></el-icon>
      <span>删除文件</span>
    </li>
  </ul>
  <file-info @closeDialog="closeDialog"></file-info>
  <arrange-image-upload @closeDialog="closeDialog"></arrange-image-upload>
</template>
<script lang="ts">
export default {
  name: 'RightClickMenu',
}
</script>
<script lang="ts" setup>
import { ref, defineEmits, inject, onMounted, reactive, provide } from 'vue'
import { HandleFile } from '@/plugin/image/arrangeImage/handle'
import FileInfo from '@/components/dialog/image/arrange/info.vue'
import ArrangeImageUpload from '@/components/dialog/image/arrange/upload.vue'
import { getDownLoadImage, downloadFile } from '@/modules/files/image'
const emit = defineEmits(['closeRightList'])
/**
 * @property {boolean} rightShow 控制右键菜单显隐
 * @property {*} rightData 右键菜单的数据
 * @property {number[]} showPosition 右键菜单显示的位置
 * @property {*} rightMenuList 右键菜单的dom
 * @property {*} dialogShow 控制相关窗口的显隐
 */
const rightShow = inject('showRight')
const rightData = inject('rightClickData')

const showPosition = inject('showPosition')
const rightMenuList = ref()
const dialogShow = reactive({
  info: false,
  upload: false,
})
provide('fileDialog', dialogShow)
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
/**
 * @method closeDialog 控制dialog显隐，主要是两个：详情、上传
 */
const closeDialog = (show: boolean, type: string) => {
  dialogShow[type] = show
}
const handle = async (type: string) => {
  switch (type) {
    case HandleFile.UPLOAD_FILE:
      dialogShow.upload = true
      break
    case HandleFile.DOWNLOAD_FILE:
      let file = await getDownLoadImage(rightData.value.id)
      downloadFile(file.data, rightData.value.name)
      break
    case HandleFile.DELETE_FILE:
      console.log(type)
      break
    case HandleFile.CREATE_DIRECTORY:
      console.log(type)
      break
    case HandleFile.SEE_INFO:
      dialogShow.info = true
      break
  }
  emit('closeRightList')
}
</script>
<style lang="scss" scoped>
ul {
  position: fixed;
  width: 170px;
  height: auto;
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
  li.create-directory {
    color: #7950f4;
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