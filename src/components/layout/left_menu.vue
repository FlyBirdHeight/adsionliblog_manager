<template>
  <el-menu
    class="left-menu left-aside left-menu-vertical"
    default-active="1"
    @open="handleOpen"
    @close="handleClose"
    text-color="var(--text-color)"
    background-color="var(--background-color)"
    active-text-color="#000000"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span style="margin-right: 10px">Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><setting /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { Location, Document, Menu as IconMenu, Setting } from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>
<style lang="scss" scoped>
:root {
  --text-color: #fff;
  --background-color: transparent;
  --el-menu-hover-bg-color: #fff;
}

</style>
