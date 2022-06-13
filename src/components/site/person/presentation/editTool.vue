<template>
  <div class="editTool">
    <div class="editTool-header">
      <span>绘板设置</span>
    </div>
    <div class="editTool-body">
      <presentation-body-setting
        @setBackground="setBackground"
        @editBackground="editBackground"
        @removeBackgroundImage="removeBackgroundImage"
      ></presentation-body-setting>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'PresentationEditTool',
}
</script>
<script lang="ts" setup>
import PresentationBodySetting from '@/components/site/person/presentation/edit/body.vue'
const props = defineProps()
const emit = defineEmits(['setItem'])
const setBackground = (val: string, defaultSetting: any) => {
  emit('setItem', { val, defaultSetting }, 'background')
}

const editBackground = (val: any) => {
  emit('setItem', val, 'backgroundEdit')
}
const removeBackgroundImage = (val: any) => {
  emit('setItem', { val }, 'removeBackgroundImage')
}
</script>
<style lang="scss" scoped>
.editTool {
  height: 100%;
  padding: 5px;
  .editTool-header {
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    letter-spacing: 1px;
    font-weight: 600;
    border-bottom: 1px solid #dcdfe6;
  }
  .editTool-body {
    height: auto;
  }
}
</style>
