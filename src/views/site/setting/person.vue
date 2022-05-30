<template>
  <div class="container-header">
    <div class="header_title">个人页设置</div>
    <el-button-group>
      <el-button :type="showType == 1 ? 'primary' : ''" @click="showList(1)"
        ><el-icon style="margin: 0 3px"> <component :is="$icon['CopyDocument']" /> </el-icon>个人轮播页设置</el-button
      >
      <el-button :type="showType == 2 ? 'primary' : ''" @click="showList(2)"
        ><el-icon style="margin: 0 3px"> <component :is="$icon['Tools']" /> </el-icon>打字机设置</el-button
      >
    </el-button-group>
  </div>
  <person-presentation v-if="showType === 1"></person-presentation>
  <person-type-writer v-else></person-type-writer>
</template>
<script lang="ts">
import { ref } from 'vue'
export default {
  name: 'SitePersonSetting',
}
</script>
<script lang="ts" setup>
import PersonPresentation from '@/components/site/person/presentation'
import PersonTypeWriter from '@/components/site/person/typewriter'
const showType = ref<number>(2)
/**
 * @method showList 设置显示列表类型
 */
const showList = (type: number) => {
  showType.value = type
}
</script>
<style lang="scss" scoped></style>
