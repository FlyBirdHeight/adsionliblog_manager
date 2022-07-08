<template>
  <el-scrollbar @scroll="showMoreCard" ref="cardScrollbar" style="height: 90% !important">
    <div class="learningCard-container">
      <div ref="learningCardContainer">
        <card-abbreviation
          v-if="cardFoldList.length !== 0"
          v-for="(cardFold, index) of cardFoldList"
          :cardInfo="cardFold"
          @clickCardInfo="clickCardInfo"
          @deleteData="deleteData"
        ></card-abbreviation>
      </div>
    </div>
    <div class="scrollbar-bottom" :style="{ opacity: showMore ? 1 : 0 }">
      <el-button type="success" v-show="showMore" @click="getMoreData">加载更多闪卡</el-button>
    </div>
  </el-scrollbar>
  <learning-card-info @closeDialog="closeDialog"></learning-card-info>
  <learning-card-edit
    :show="show.editCard"
    :cardInfo="cardInfo"
    @closeDialog="closeDialog"
    @updateShowData="updateShowData"
  ></learning-card-edit>
</template>
<script lang="ts">
import { ref, nextTick, onMounted, reactive, provide, defineEmits, watchEffect, inject } from 'vue'
import { CardFold } from '@/modules/type/cardFold'
import { getData } from '../../../plugin/page/learning_card/handle'
export default {
  name: 'LearningCardContainer',
}
</script>
<script lang="ts" setup>
const Masonery = require('masonry-layout')
import CardAbbreviation from '@/components/pages/learning_card/card.vue'
import LearningCardInfo from '@/components/dialog/page/learning_card/info.vue'
import LearningCardEdit from '@/components/dialog/page/learning_card/edit.vue'
const emit = defineEmits(['changeUpdateStatus'])
/**
 * @property {CardFold[]} cardFoldList 学习闪卡展示数据
 */
const cardFoldList = ref<CardFold[]>([])
const show = reactive({
  cardFold: false,
  editCard: false,
})
const pagination = reactive({
  page: 1,
  size: 10,
  sort: { name: 'sort', type: 'desc' },
})
const cardInfo = ref<CardFold | null>(null)
const totalCount = ref<number>(0)
const questionIndex = ref<number>(0)
const updateList = inject('update')
const cardScrollbar = ref()
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
const closeDialog = (type: string = '') => {
  if (type == '') {
    show.editCard = false
    return
  }
  show[type] = false
}
/**
 * NOTE: 下面的内容是为了构建网格的，实现流瀑式自动布局
 */
const learningCardContainer = ref()
const buildGridLayout = () => {
  let status = totalCount.value > pagination.page * pagination.size
  nextTick(() => {
    var msnry = new Masonery(learningCardContainer.value, {
      itemSelector: '.cardAbbreviation',
      horizontalOrder: true,
    })
    let dom = cardScrollbar.value.wrap$
    const height = dom.children[0].getBoundingClientRect().height
    if (dom.clientHeight + dom.scrollTop < height) {
      if (height - (dom.clientHeight + dom.scrollTop) < 50 && !showMore.value) {
        showMore.value = status ? true : false
      } else {
        showMore.value = false
      }
    } else {
      showMore.value = status ? true : false
    }
  })
}
onMounted(async () => {
  let data = await getData('list', pagination)
  cardFoldList.value = data.data
  totalCount.value = data.total
  buildGridLayout()
})
watchEffect(async () => {
  if (updateList.value) {
    let data = await getData('list', pagination)
    cardFoldList.value = data.data
    totalCount.value = data.total
    buildGridLayout()
    emit('changeUpdateStatus')
  }
})
const getMoreData = async () => {
  showMore.value = false
  pagination.page = pagination.page + 1
  let data = await getData('list', pagination)
  cardFoldList.value = cardFoldList.value.concat(data.data)
  buildGridLayout()
}
const deleteData = (id: number) => {
  let idx = cardFoldList.value.findIndex((v) => v.id === id)
  if (idx === -1) {
    return
  }
  cardFoldList.value.splice(idx, 1)
  buildGridLayout()
}
const updateShowData = async (id: number) => {
  let index = cardFoldList.value.findIndex((v) => v.id === id)
  let newData = await getData('info', { id: id })
  cardFoldList.value[index] = newData
  buildGridLayout()
}
const showMore = ref<boolean>(false)
const showMoreCard = () => {
  let status = totalCount.value > pagination.page * pagination.size
  nextTick(() => {
    let dom = cardScrollbar.value.wrap$
    const height = dom.children[0].getBoundingClientRect().height
    if (dom.clientHeight + dom.scrollTop < height) {
      if (height - (dom.clientHeight + dom.scrollTop) < 50 && !showMore.value) {
        showMore.value = status ? true : false
      } else {
        showMore.value = false
      }
    } else {
      showMore.value = status ? true : false
    }
  })
}
</script>
<style lang="scss" scoped>
.learningCard-container {
  margin-bottom: 50px;
}
.scrollbar-bottom {
  position: absolute;
  bottom: 10px;
  text-align: center;
  width: 100%;
  height: 40px;
  transition: all 0.5s linear;
}
</style>
