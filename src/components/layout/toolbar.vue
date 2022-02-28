<template>
  <div class="toolbar">
    <div class="toolbar_menu">
      <el-button type="primary" class="none-border" :icon="buttonIcon" @click="changeStatus"></el-button>
    </div>
    <div class="toolbar_title">adsionli博客管理</div>
    <div class="toolbar_status">status</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, watchEffect } from 'vue'
import { Close, Fold } from '@element-plus/icons-vue'
const buttonIcon: any = shallowRef(Close)
const showType = ref(true)
const changeStatus = () => {
  showType.value = !showType.value
}
watchEffect(() => {
  buttonIcon.value = showType.value ? Close : Fold
})
</script>
<style lang="scss">
.toolbar .toolbar_menu {
  .none-border {
    border: 0;
    background-color: rgba(1, 1, 1, 0);
    color: #000000;
  }
}
</style>
