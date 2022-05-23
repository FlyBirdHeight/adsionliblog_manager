<template>
  <dialog-show
    :modal="true"
    :draggable="false"
    :showFooter="false"
    :title="title"
    :width="'400px'"
    :show="props.show"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <learning-card-form
        style="max-height: 700px; overflow-y: auto"
        @closeDialog="closeDialog"
        @submitForm="submitForm"
      />
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineEmits, defineProps, computed, reactive } from 'vue'
import { CardFold, InsertCardFold } from '@/modules/type/cardFold'
export default {
  name: 'LearningCardEdit',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
import LearningCardForm from '@/components/form/page/learning_card_form.vue'
const props = defineProps<{
  show: boolean
  cardInfo?: CardFold
}>()
const emit = defineEmits(['closeDialog'])
const title = '添加闪卡'
const type = computed(() => {
  if (props.cardInfo) {
    return 'update'
  }
  return 'add'
})
/**
 * @method submitForm 提交表单数据
 * @param {EditCardFold} val 提交数据
 * @param {string} type 提交类型
 */
const submitForm = (val: EditCardFold, type: string) => {
  console.log(val, type)
}
const closeDialog = () => {
  emit('closeDialog')
}
</script>
<style lang="scss" scoped>
.buttom-edit {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
