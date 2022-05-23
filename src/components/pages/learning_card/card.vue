<template>
  <div class="cardAbbreviation">
    <div class="cardAbbreviation-header">
      <el-tooltip effect="dark" :content="cardInfo.title" placement="top-start">
        <div class="cardAbbreviation-header_title">
          {{ cardInfo.title }}
        </div>
      </el-tooltip>
      <div class="cardAbbreviation-header_button">
        <el-button-group size="small">
          <el-button type="info" @click="see(cardInfo, 0)">查看</el-button>
          <el-button type="primary" @click="edit(cardInfo)">修改</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="container-divide" />
    <div class="cardAbbreviation-body">
      <div v-if="cardInfo.questions.length != 0">
        <div
          @click="see(cardInfo, index)"
          class="cardAbbreviation-body_item"
          v-for="(question, index) of cardInfo.questions.slice(0, maxShowLength)"
        >
          {{ index + 1 }}. {{ question.title }}
        </div>
        <el-tooltip v-if="cardInfo.questions.length > 4" effect="dark" content="更多问题查看" placement="right-start">
          <div
            class="cardAbbreviation-body_item"
            style="cursor: pointer"
            @click="see(cardInfo, maxShowLength)"
            v-if="cardInfo.questions.length > 4"
          >
            <span>......</span>
          </div>
        </el-tooltip>
      </div>
      <div class="cardAbbreviation-body_none" v-else>暂未设置问题</div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { CardFold } from '@/modules/type/cardFold'
export default {
  name: 'CardAbbreviation',
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  cardInfo: CardFold
}>()
const emit = defineEmits(['clickCardInfo'])
const maxShowLength = ref<number>(4)
/**
 * @method see 查看学习闪卡具体内容
 */
const see = (cardInfo: CardFold, index: number, type: string) => {
  emit('clickCardInfo', cardInfo, { index, type: 'see' })
}
const edit = (cardInfo: CardFold) => {
  emit('clickCardInfo', cardInfo, { type: 'edit' })
}
</script>
<style lang="scss" scoped>
.cardAbbreviation {
  border: 1px solid #e4e7ed;
  height: auto;
  border-radius: 4px;
  margin: 15px 20px;
  width: 350px;
  box-shadow: 0px 20px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 15px rgba(0, 0, 0, 0.08);
  .cardAbbreviation-header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 5px;
    .cardAbbreviation-header_title {
      font-weight: 600;
      font-size: 15px;
      max-width: 50%;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cardAbbreviation-header_button {
    }
  }
  .container-divide {
    border-top: 2px solid #d4d7de;
  }
  .cardAbbreviation-body {
    padding: 0 5px;
    .cardAbbreviation-body_item {
      height: 35px;
      margin: 5px 5px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      line-height: 35px;
      color: #606266;
    }
    .cardAbbreviation-body_item:hover {
      background-color: rgba(217, 236, 255, 0.4);
      color: #00b894;
      cursor: pointer;
      font-weight: 800;
      border-radius: 5px;
      padding: 0 10px;
    }
    .cardAbbreviation-body_none {
      height: 150px;
      padding: 0 5px;
      font-size: 17px;
      font-weight: 600;
      color: #c0c4cc;
      text-align: center;
      line-height: 150px;
    }
  }
}
</style>
