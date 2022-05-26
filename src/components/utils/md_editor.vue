<template>
  <md-editor :preview="props.preview" :toolbars="props.toolbar" :onUploadImg="uploadImage" v-model="page.text" />
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import 'md-editor-v3/lib/style.css'
import { UploadImage } from '@/modules/files/uploadImage'
export default {
  name: 'BaseMdEditor',
}
</script>
<script lang="ts" setup>
import MdEditor from '@/modules/markdown/MdEditor'
const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
  toolbar: {
    type: Array,
    default: ['all'],
  },
  submit: {
    type: Boolean,
    default: false,
  },
})
const page = reactive({
  text: '',
})
const emit = defineEmits(['submitData'])
const upload = new UploadImage()
const uploadImage = async (files: FileList, callback: (urls: string[]) => void) => {
  try {
    const res: any = await upload.uploadImage(files)
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
      if (statusFalseImage.length != 0) {
        ElNotification.warning({
          title: '图片存在重名',
          message: '请确认是否需要重新上传图片，重名图片需重命名后才可使用！',
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
}
watchEffect(() => {
  if (props.submit) {
    emit('submitData', page.text)
    page.text = ''
  }
})
</script>
<style lang="scss" scoped></style>
