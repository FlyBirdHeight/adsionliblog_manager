<template>
  <div class="file-list-header">
    <div class="title">文件整理</div>
    <el-button-group>
      <el-button :type="showType == 1 ? 'primary' : ''" @click="showList(1)"
        ><el-icon style="margin: 0 3px"> <component :is="$icon['Reading']" /> </el-icon>分栏显示</el-button
      >
      <el-button :type="showType == 2 ? 'primary' : ''" @click="showList(2)"
        ><el-icon style="margin: 0 3px"> <component :is="$icon['Fold']" /> </el-icon>列表显示</el-button
      >
    </el-button-group>
    <el-button-group class="emit_button-group">
      <el-button @click="addFile" type="primary">添加</el-button>
      <el-button @click="deleteFile" type="danger">删除</el-button>
      <el-button @click="refreshList" type="success">刷新</el-button>
    </el-button-group>
  </div>
</template>
<script lang="ts">
export default {
  name: 'FileListHeader',
}
</script>
<script lang="ts" setup>
import { ref, defineEmits, computed, watch, reactive, watchEffect, inject } from 'vue'
const showType = inject('showType')
const emit = defineEmits(['changeShow'])
/**
 * @method addFile 添加文件、文件夹
 */
const addFile = () => {
  console.log('addFile')
}
/**
 * @method deleteFile 删除文件、文件夹
 */
const deleteFile = () => {
  console.log('deleteFile')
}
/**
 * @method refreshList 刷新列表
 */
const refreshList = () => {
  console.log('refreshList')
}
/**
 * @method showList 设置显示列表类型
 */
const showList = (type: number) => {
  emit('changeShow', type)
}
</script>
<style lang="scss" scoped>
.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 1.5rem;
    font-weight: inherit;
    color: #606266;
  }
}
</style>
