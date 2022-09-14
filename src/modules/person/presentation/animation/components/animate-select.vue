<template>
  <el-cascader v-model="checkData" :options="options" :disabled="activeItem === null">
    <template #default="{ node, data }">
      <el-icon><component :is="$icon[data.icon]" /></el-icon>
      <span style="margin-left: 10px">{{ data.label }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { useModel } from '../hooks/useModel'
import { AnimateSelect, ItemAnimateSelect } from '../data/item_animate'
import useActiveItem from '../hooks/useActiveItem'
export default {
  name: 'AnimateSelect',
}
</script>
<script lang="ts" setup>
const props = defineProps({
  checkData: Array,
})
const checkData = useModel(props)
const options: ItemAnimateSelect[] = AnimateSelect
const activeItem = useActiveItem();
</script>
<style lang="scss" scoped></style>
