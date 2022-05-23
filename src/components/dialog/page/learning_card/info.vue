<template>
  <dialog-show
    :modal="true"
    :draggable="false"
    :showFooter="false"
    :title="title"
    :width="'450px'"
    :show="show.cardFold"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <card-fold-info></card-fold-info>
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineEmits, watch, watchEffect, inject, reactive, computed } from 'vue'
export default {
  name: 'LearningCardInfo',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import CardFoldInfo from '@/components/pages/learning_card/card_fold.vue'
const emit = defineEmits(['closeDialog'])
const show = inject('show')
const cardInfo = inject('cardInfo')
const title = computed(() => {
  let name = cardInfo.value ? cardInfo.value.title : ''
  return name
})

const closeDialog = () => {
  emit('closeDialog', 'cardFold')
}
</script>
<style lang="scss" scoped></style>
