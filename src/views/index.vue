<template>
  <el-config-provider :locale="local">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="includeList">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useRouter, useRoute } from 'vue-router'
import { computed, watch, ref, watchEffect } from 'vue'
import { useState } from '../utils/store/map'
const local = zhCn
const includeList = ref([])
const storeState = useState('header', ['routerList'])
watch(
  storeState.routerList,
  (newV, oldV) => {
    includeList.value = [];
    if (newV.length != 0) {
      for (let v of newV) {
        if (includeList.value.findIndex((data) => data === v.componentName) === -1) {
          includeList.value.push(v.componentName)
        }
      }
    }
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss"></style>
