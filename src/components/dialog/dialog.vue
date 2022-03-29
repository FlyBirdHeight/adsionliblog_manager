<template>
  <el-dialog
    v-model="showDialog"
    @close="closeDialog"
    :modal="props.modal"
    :append-to-body="true"
    :title="props.title"
    :width="props.width"
    :draggable="props.draggable"
  >
    <slot name="mainBody"></slot>
    <template #footer>
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
})
const showDialog = ref<boolean>(false);
watch(() => props.show, (newV, oldV) => {
  showDialog.value = newV;
})
const closeDialog = function () {
  emit('closeDialog', false)
}
</script>
<style lang="scss"></style>
