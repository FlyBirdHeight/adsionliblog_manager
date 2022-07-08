<template>
  <el-dialog
    v-model="showDialog"
    @close="closeDialog"
    :modal="props.modal"
    :append-to-body="props.toBody"
    :title="props.title"
    :width="props.width"
    :draggable="props.draggable"
  >
    <div v-load="dialogLoading" :element-loading-text="loadingText">
      <slot name="mainBody"></slot>
    </div>
    <template #footer v-if="showFooter">
      <slot name="foot"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'DialogShow',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const emit = defineEmits(['closeDialog'])
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  modal: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '30%',
  },
  show: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  dialogLoading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: '正在请求',
  },
  toBody: {
    type: Boolean,
    default: true,
  },
})
const showDialog = ref<boolean>(false)
watch(
  () => props.show,
  (newV, oldV) => {
    showDialog.value = newV
  }
)
const closeDialog = function () {
  emit('closeDialog', false)
}
</script>
<style lang="scss"></style>
