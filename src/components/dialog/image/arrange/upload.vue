<template>
  <dialog-show :title="title" :width="'400px'" :show="show.upload" @closeDialog="closeDialog">
    <template #mainBody>
      <div class="arrange-image-upload">
        
      </div>
    </template>
    <template #foot>
        <el-button size="small" type="primary" @click="submitForm">上传</el-button>
        <el-button size="small" type="danger" @click="closeDialog">关闭</el-button>
    </template>
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'ArrangeImageUpload',
}
</script>
<script lang="ts" setup>
import { ref, inject, defineProps, defineEmits, computed, watch, provide, watchEffect } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
const emit = defineEmits(['closeDialog'])
const show = inject('fileDialog')
const fileInfo = inject('rightClickData')
const title = "文件上传"
const submit = ref<boolean>(false);
provide("submitUpload", submit)

const closeDialog = (val: boolean = false) => {
  emit('closeDialog', false, 'upload')
}
const submitForm = () => {
    submit.value = true;
}
</script>
<style lang="scss" scoped></style>
