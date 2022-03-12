<template>
  <el-form class="form-border" label-position="left" :model="data" label-width="80px">
    <el-form-item label="标题:">
      <el-input v-model="data.title" placeholder="请输入文章标题" />
    </el-form-item>
    <el-form-item label="副标题:">
      <el-input v-model="data.subTitle" placeholder="请输入文章副标题" />
    </el-form-item>
    <el-form-item label="文章介绍:">
      <el-input v-model="data.description" placeholder="请输入文章介绍" />
    </el-form-item>
    <el-form-item label="发布时间:">
      <el-date-picker style="width: 100%" v-model="data.writingDate" type="date" placeholder="选择发布日期" />
    </el-form-item>
  </el-form>
  <md-editor style="margin-top: 20px" preview-theme="github" :onUploadImg="uploadImage" v-model="data.page" />
</template>
<script lang="ts">
import { ref, defineComponent, reactive, computed, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import axios from 'axios'
import { UploadImage, UploadImageResponse, WritingForm } from '@/modules/files/uploadImage'
export default defineComponent({
  name: 'Writing',
  props: {
    sendData: Boolean,
  },
  components: {
    MdEditor
  },
  emits: ['dataGet'],
  setup(props, context) {
    const upload = new UploadImage()
    const form: WritingForm = {
      title: '',
      subTitle: '',
      description: '',
      writingDate: '',
      page: '',
    }
    const data = reactive(form)
    const dataGet = () => {
      context.emit('dataGet', data)
    }
    watch(
      () => props.sendData,
      (newV, oldV) => {
        if (newV) {
          dataGet()
        }
      }
    )
    const uploadImage = async (files: FileList, callback: (urls: string[]) => void) => {
      try {
        const res: any = await upload.uploadImage(files)
        console.log(res)
        if (res.length != 0) {
          let callbackImageList: Array<string> = new Array<string>(res.length)
          let statusFalseImage = new Array()
          for (let i = 0; i < res.length; i++) {
            if (!res[i].status) {
              statusFalseImage.push(res[i].id)
            } else {
              callbackImageList.push(res[i].url)
            }
          }
          callbackImageList.length != 0 && callback(callbackImageList.map((item: any) => item))
          if(statusFalseImage.length != 0){
            ElNotification.warning({
              title: "图片存在重名",
              message: "请确认是否需要重新上传图片，重名图片需重命名后才可使用！"
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    return {
      data,
      dataGet,
      uploadImage,
    }
  },
})
</script>
<style lang="scss" scoped>
.form-border {
  border: 2px dashed rgba(229, 231, 235, 0.8);
  padding: 10px;
  border-radius: 5px;
}
</style>
