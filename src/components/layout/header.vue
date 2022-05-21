<template>
  <div class="router-header">
    <el-tag v-for="tag in headerList" :key="tag.name" closable>
      {{ tag.name }}
    </el-tag>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
export default {
  name: 'RouterHeader',
}
</script>
<script lang="ts" setup>
const headerList = ref([])
// const header
</script>
<style lang="scss" scoped>
.router-header {
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  height: 30px;
  padding: 5px;
  margin: 5px;
}
</style>
