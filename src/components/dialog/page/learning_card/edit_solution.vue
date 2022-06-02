<template>
  <dialog-show
    :modal="true"
    :draggable="false"
    :showFooter="true"
    :title="props.title"
    :width="'60%'"
    :show="props.show"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <base-md-editor
        :preview="editor.preview"
        :toolbar="editor.toolbar"
        :submit="editor.submit"
        :page="props.page"
        @submitData="submitData"
      ></base-md-editor>
    </template>
    <template #foot>
      <div class="edit-solution-footer">
        <el-button @click="submitSolution" type="primary">确认</el-button>
        <el-button @click="closeDialog" type="info">取消</el-button>
      </div>
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'EditSolutionData',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import BaseMdEditor from '@/components/utils/md_editor.vue'
const props = defineProps<{
  show: boolean
  title: string
  index: number
  page: string
}>()
const editor = reactive({
  preview: false,
  toolbar: ['image', '-', 'preview'],
  submit: false,
})
const emit = defineEmits(['closeDialog', 'setSolution'])
const submitSolution = () => {
  editor.submit = true
}
const submitData = (val: string) => {
  editor.submit = false
  emit('setSolution', val, props.index)
  emit('closeDialog')
}
const closeDialog = () => {
  emit('closeDialog')
}
</script>
<style lang="scss" scoped>
.edit-solution-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
