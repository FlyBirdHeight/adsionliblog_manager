<template>
  <dialog-show :showFooter="false" :title="title" :width="'300px'" :show="show.createDirectory" @closeDialog="closeDialog">
  </dialog-show>
</template>
<script lang="ts">
export default {
  name: 'Name',
}
</script>
<script lang="ts" setup>
import { ref, defineEmits, watch, reactive, inject } from 'vue'
import DialogShow from '@/components/dialog/dialog.vue'
const emit = defineEmits(['closeDialog'])
const show = inject('fileDialog')
const title = "新建文件夹"

const closeDialog = (val: boolean = false) => {
  emit('closeDialog', false, 'createDirectory')
}
</script>
<style lang="scss" scoped></style>
