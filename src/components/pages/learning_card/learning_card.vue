<template>
  <div ref="learningCardContainer" class="learningCard-container">
    <card-abbreviation
      v-if="cardFoldList.length !== 0"
      v-for="(cardFold, index) of cardFoldList"
      :cardInfo="cardFold"
      @clickCardInfo="clickCardInfo"
    ></card-abbreviation>
  </div>
  <learning-card-info @closeDialog="closeDialog"></learning-card-info>
</template>
<script lang="ts">
import { ref, nextTick, onMounted, reactive, provide } from 'vue'
import { CardFold } from '@/modules/type/cardFold'
export default {
  name: 'LearningCardContainer',
}
</script>
<script lang="ts" setup>
const Masonery = require('masonry-layout')
import CardAbbreviation from '@/components/pages/learning_card/card.vue'
import LearningCardInfo from '@/components/dialog/page/learning_card/info.vue'
import { getData } from '../../../plugin/page/learning_card/handle'
/**
 * @property {CardFold[]} cardFoldList 学习闪卡展示数据
 */
const cardFoldList = ref<CardFold[]>([])
const show = reactive({
  cardFold: false,
  editCard: false,
  addCard: false,
})
const pagination = reactive({
  page: 1,
  size: 20,
  sort: { name: 'sort', type: 'desc' },
})
const cardInfo = ref<CardFold | null>(null)
const questionIndex = ref<number>(0)
provide('show', show)
provide('cardInfo', cardInfo)
provide('questionIndex', questionIndex)
/**
 * @method clickCardInfo 点击卡片信息
 * @param {CardFold} info 点击数据内容
 * @param {{index?:number, type: string}} options 携带参数
 */
const clickCardInfo = (info: CardFold, options: { index?: number; type: string }) => {
  cardInfo.value = info
  if (options.type == 'see') {
    show.cardFold = true
    questionIndex.value = options.index
  } else {
    show.editCard = true
  }
}
/**
 * @method closeDialog 关闭视窗
 * @param {string} type 类型
 */
const closeDialog = (type: string) => {
  show[type] = false
}
/**
 * NOTE: 下面的内容是为了构建网格的，实现流瀑式自动布局
 */
const learningCardContainer = ref()
const buildGridLayout = () => {
  nextTick(() => {
    var msnry = new Masonery(learningCardContainer.value, {
      itemSelector: '.cardAbbreviation',
      horizontalOrder: true,
    })
  })
}
onMounted(async () => {
  cardFoldList.value = await getData('list', pagination)
  console.log(cardFoldList.value)
  buildGridLayout()
})
</script>
<style lang="scss" scoped>
.learningCard-container {
}
</style>
