<template>
  <md-editor
    :previewOnly="props.previewOnly"
    :preview="props.preview"
    previewTheme="github"
    :toolbars="props.toolbar"
    :onUploadImg="uploadImage"
    v-model="page.text"
  />
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
  previewOnly: {
    type: Boolean,
    default: false,
  },
  previewOnlyData: {
    type: String,
    default: '',
  },
  page: {
    type: String,
    default: '',
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
watch(
  () => props.submit,
  (newV, oldV) => {
    if (newV) {
      console.log(newV)

      emit('submitData', page.text)
      page.text = ''
    }
  }
)
watchEffect(() => {
  if (props.previewOnly) {
    page.text = props.previewOnlyData
  }
})
watchEffect(() => {
  if (props.page !== '') {
    page.text = props.page
  }
})
</script>
<style lang="scss" scoped>
.md {
  --md-bk-color: transparent;
}
</style>
