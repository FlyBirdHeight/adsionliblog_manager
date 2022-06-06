<template>
  <transition name="question-list-show">
    <div class="learning-card_question-list" style="overflow-x: hidden" v-show="show">
      <div class="question-header">
        <div class="title">问题列表</div>
        <div class="edit">
          <transition name="fold-apply">
            <span v-if="!fold" @click.stop="fold = !fold">
              <el-tooltip content="收起" placement="top-start">
                <el-icon><component :is="$icon['Remove']" /></el-icon>
              </el-tooltip>
            </span>
            <span v-else @click.stop="fold = !fold">
              <el-tooltip content="展开" placement="top-start">
                <el-icon><component :is="$icon['CirclePlus']" /></el-icon>
              </el-tooltip>
            </span>
          </transition>
          <span @click.stop="emit('changeShowQuestionList', false)">
            <el-tooltip content="隐藏" placement="top-start">
              <el-icon><component :is="$icon['CircleClose']" /></el-icon>
            </el-tooltip>
          </span>
        </div>
      </div>
      <transition name="question-list-item-show">
        <el-scrollbar height="400px" v-if="!fold">
          <div class="question-body">
            <div
              :class="checkedQuestion == index ? 'question-body-item-active' : 'question-body-item'"
              @click="checkQuestion(index)"
              v-for="(item, index) of questionList"
            >
              <span class="item-index">{{ index + 1 }}. </span>
              <el-tooltip :content="item.title" placement="top-end">
                <span class="question">{{ item.title }}</span>
              </el-tooltip>
            </div>
          </div>
        </el-scrollbar>
      </transition>
    </div>
  </transition>
</template>
<script lang="ts">
export default {
  name: 'LearningCardQuestionList',
}
</script>
<script lang="ts" setup>
import { ref, inject, watch, defineEmits } from 'vue'
const emit = defineEmits(['checkShowQuestion', 'changeShowQuestionList'])
const cardInfo = inject('cardInfo')
const questionList = ref([])
const fold = ref<boolean>(false)
const show = inject('showQuestionList')
const checkIndex = inject('checkIndex')
const checkedQuestion = ref<number>(-1)
const checkQuestion = (item) => {
  checkedQuestion.value = item
  emit('checkShowQuestion', item)
}
watch(checkIndex, (newV, oldV) => {
  if (newV.value !== -1) {
    checkedQuestion.value = newV
  }
})
watch(
  cardInfo,
  (newV, oldV) => {
    if (newV.questions && newV.questions.length != 0) {
      questionList.value = newV.questions
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
.learning-card_question-list {
  @media screen and (min-width: 2000px) {
    right: calc(-350px - 10px);
    width: 350px;
  }
  @media screen and (max-width: 2000px) {
    right: calc(-35% - 10px);
    width: 35%;
  }
  position: absolute;
  top: 20%;
  background-color: #fff;
  box-shadow: -5px 12px 32px 4px rgba(0, 0, 0, 0.08), -5px 8px 12px 2px rgba(0, 0, 0, 0.04);
  padding: 5px;
  border-radius: 5px;
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-weight: 600;
    font-size: 1rem;
    border-bottom: 2px solid #f2f6fc;
    .edit {
      display: flex;
      justify-content: space-around;
      span {
        width: 25px;
        cursor: pointer;
        font-size: 1.25rem;
      }
    }
  }
  .question-body {
    width: 95%;
    overflow: hidden;
    .question-body-item {
      text-overflow: ellipsis;
      height: 40px;
      white-space: nowrap;
      overflow: hidden;
      line-height: 40px;
      width: 100%;
      .item-index {
        font-weight: 500;
        color: #909399;
        font-size: 15px;
      }
      .question {
        font-weight: 400;
        color: #606266;
        font-size: 12px;
      }
    }
    .question-body-item:hover {
      background-color: rgba(217, 236, 255, 0.4);
      cursor: pointer;
      border-radius: 5px;
      padding: 0 5px;
      overflow-x: hidden;
    }
    .question-body-item:hover .item-index,
    .question-body-item:hover .question {
      font-weight: 800;
      color: #00b894;
    }

    .question-body-item-active {
      border-radius: 5px;
      background-color: #409eff;
      color: #fff;
      font-weight: 600;
      padding: 0 5px;
      text-overflow: ellipsis;
      height: 40px;
      white-space: nowrap;
      overflow: hidden;
      line-height: 40px;
      width: 95%;
      cursor: pointer;
      .item-index {
        font-size: 15px;
      }
      .question {
        font-size: 12px;
      }
    }
  }
}

.question-list-show-enter-from,
.question-list-show-leave-to {
  opacity: 0;
}
.question-list-show-enter-to,
.question-list-show-leave {
  opacity: 1;
}
.question-list-show-enter-active,
.question-list-show-leave-active {
  transition: all 0.5s linear;
}

.fold-apply-enter-from,
.fold-apply-leave-to {
  transform: translateX(-100%) rotate(180deg);
  opacity: 0;
}
.fold-apply-enter-to,
.fold-apply-leave {
  transform: translateX(0%) rotate(0deg);
  opacity: 1;
}
.fold-apply-enter-active,
.fold-apply-leave-active {
  transition: all 0.5s linear;
}

.question-list-item-show-enter-from {
  opacity: 0;
  max-height: 0;
}
.question-list-item-show-enter-to {
  max-height: 400px;
  opacity: 1;
}
.question-list-item-show-enter-active {
  transition: all 0.5s linear;
}
.question-list-item-show-leave-active {
  transition: all 0.5s linear;
  max-height: 400px;
}
.question-list-item-show-leave-to {
  max-height: 0;
  opacity: 0;
}
.question-list-item-show-leave {
  max-height: 400px;
  opacity: 1;
}
</style>
