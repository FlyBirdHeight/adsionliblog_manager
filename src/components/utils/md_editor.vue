<template>
  <md-editor
    :previewOnly="props.previewOnly"
    :preview="props.preview"
    previewTheme="github"
    :toolbars="props.toolbar"
    :onUploadImg="uploadImage"
    v-model="page.text"
    v-load.fullscreen.lock="submitImage"
    element-loading-text="正在上传图片，请稍后"
  />
  <editor-image-setting
    :show="showImageSetting"
    :imageList="imageSettingList"
    @submitSetting="submitImageSetting"
    @closeDialog="closeDialog"
  />
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { handleAndUpload, UploadFile } from '@/modules/files/slice.ts'
import 'md-editor-v3/lib/style.css'
export default {
  name: 'BaseMdEditor',
}
</script>
<script lang="ts" setup>
import MdEditor from '@/modules/markdown/MdEditor'
import EditorImageSetting from '@/components/dialog/utils/editor_image_setting'
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
  imageUrl: {
    type: String,
    default: '/images/editor',
  },
})
const page = reactive({
  text: '',
})
const emit = defineEmits(['submitData'])
const showImageSetting = ref<boolean>(false)
const imageSettingList = ref<UploadFile[]>([])
const submitImage = ref<boolean>(false)
const submitImageCb = ref(null)
const uploadImage = async (files: FileList, callback: (urls: string[]) => void) => {
  try {
    console.log(files);
    //NOTE: 先把数据处理一下，然后弹出设置框，让其设置好路径，然后再上传
    imageSettingList.value = []
    files.forEach((v, index) => {
      let uploadFile = {
        index,
        file: v,
        name: v.name,
        sliceFile: [],
        path: props.imageUrl,
        isExist: false,
        is_create: false,
        directory_id: null,
        status: 'ready',
      }
      imageSettingList.value.push(uploadFile)
    })
    showImageSetting.value = true
    submitImageCb.value = callback
  } catch (e) {
    console.log(e)
  }
}
const closeDialog = () => {
  showImageSetting.value = false
}
const submitImageSetting = async (val) => {
  for (let v of val) {
    imageSettingList.value[v.index] = Object.assign(imageSettingList.value[v.index], v)
  }
  submitImage.value = true
  try {
    let data = await handleAndUpload(imageSettingList.value, null)
    submitImage.value = false
    ElMessage({
      type: 'success',
      message: '图片上传成功',
      grouping: true,
    })
    submitImageCb.value(data)
  } catch (e) {
    submitImage.value = false
    console.log(e)
  }
  showImageSetting.value = false
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
