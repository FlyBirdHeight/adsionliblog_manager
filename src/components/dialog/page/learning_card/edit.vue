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
        :type="type"
        :cardInfo="cardInfo"
        @closeDialog="closeDialog"
        @updateList="updateList"
        @updateShowData="updateShowData"
      />
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineEmits, defineProps, computed, reactive } from 'vue'
import { CardFold, EditCardFold } from '@/modules/type/cardFold'
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
const emit = defineEmits(['closeDialog', 'updateList', 'updateShowData'])
const title = '添加闪卡'
const type = computed(() => {
  if (props.cardInfo) {
    return 'update'
  }
  return 'add'
})
/**
 * @method updateList 创建成功后，刷新闪卡内容
 */
const updateList = () => {
  emit('updateList')
}
const closeDialog = () => {
  emit('closeDialog')
}
/**
 * @method updateShowData 如果是更改已有数据内容，就需要返回数据id
 * @param {number} id
 */
const updateShowData = (id: number) => {
  emit('updateShowData', id)
}
</script>
<style lang="scss" scoped>
.buttom-edit {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
