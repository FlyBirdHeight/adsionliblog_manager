<template>
  <dialog-show
    :modal="true"
    :draggable="false"
    :showFooter="false"
    :title="title"
    :width="'50%'"
    :show="show.cardFold"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <card-fold-info v-if="show.cardFold" @changeShowQuestionList="changeShowQuestionList" @checkShowQuestion="checkShowQuestion"></card-fold-info>
      <learning-card-question-list @checkShowQuestion="checkShowQuestion" @changeShowQuestionList="changeShowQuestionList"></learning-card-question-list>
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineEmits, watch, watchEffect, inject, reactive, computed, provide } from 'vue'
export default {
  name: 'LearningCardInfo',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import CardFoldInfo from '@/components/pages/learning_card/card_fold.vue'
import LearningCardQuestionList from '@/components/pages/learning_card/question_list.vue'
const emit = defineEmits(['closeDialog'])
const show = inject('show')
const cardInfo = inject('cardInfo')
const checkIndex = ref<number>(-1)
const showQuestionList = ref<boolean>(true)
provide('checkIndex', checkIndex)
provide('showQuestionList', showQuestionList)
const title = computed(() => {
  let name = cardInfo.value ? cardInfo.value.title : ''
  return name
})
const changeShowQuestionList = (val: boolean) => {
  showQuestionList.value = val
}
const checkShowQuestion = (val: any) => {
  checkIndex.value = val
}
const closeDialog = () => {
  emit('closeDialog', 'cardFold')
}
</script>
<style lang="scss" scoped></style>
