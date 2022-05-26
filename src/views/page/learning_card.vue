<template>
  <div class="learning-header">
    <h2 class="header-title">学习闪卡</h2>
    <el-button type="success" size="small" @click="addLearningCard">添加学习闪卡</el-button>
  </div>
  <learning-card-container @changeUpdateStatus="changeUpdateStatus"></learning-card-container>
  <learning-card-edit :show="showAddDialog" @closeDialog="closeDialog" @updateList="updateList"></learning-card-edit>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, provide } from 'vue';
export default {
  name: 'LearningCard',
}
</script>
<script lang="ts" setup>
import LearningCardContainer from '@/components/pages/learning_card/learning_card.vue'
import LearningCardEdit from '@/components/dialog/page/learning_card/edit.vue'
const showAddDialog = ref<boolean>(false)
const updateData = ref<boolean>(false)
provide('update', updateData)
const addLearningCard = () => {
  showAddDialog.value = true
}
const updateList = () => {
  updateData.value = true;
}
const changeUpdateStatus = () => {
  updateData.value = false;
}
const closeDialog = () => {
  showAddDialog.value = false
}
</script>
<style lang="scss" scoped>
.learning-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: inherit;
  }
}
</style>
