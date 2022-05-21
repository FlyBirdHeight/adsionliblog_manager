<template>
  <el-config-provider :locale="local">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const local = zhCn
</script>

<style lang="scss"></style>
