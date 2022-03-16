<template>
  <el-config-provider :locale="local">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts">
import { defineComponent, h } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { setup } from 'vue-class-component'
export default defineComponent({
  setup() {
    return {
      local: zhCn,
    }
  },
})
</script>

<style lang="scss"></style>
