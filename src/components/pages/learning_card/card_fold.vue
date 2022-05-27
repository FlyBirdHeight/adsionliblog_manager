<template>
  <div class="container">
    <el-tag
      effect="dark"
      :type="difficultyTag[cardInfo.questions[showIndex].difficulty]"
      style="position: absolute; top: -20px; right: 20px; z-index: 999"
      >难度:{{ difficultyLevel[cardInfo.questions[showIndex].difficulty] }}</el-tag
    >
    <div class="arrow" v-if="cardInfo.questions.length != 0" @click="changeQuestion('pre')">
      <el-icon><component :is="$icon['ArrowLeftBold']" /></el-icon>
    </div>
    <div class="body-container">
      <div class="question-container">
        <transition name="question-active">
          <div class="question" :key="showIndex">
            <span>{{ cardInfo.questions[showIndex].title }}</span>
          </div>
        </transition>
      </div>
      <div class="solution-container">
        <transition name="solution-active">
          <div class="solution" v-if="showSolution">
            <base-md-editor
              :previewOnly="true"
              :previewOnlyData="cardInfo.questions[showIndex].solution"
            ></base-md-editor>
          </div>
          <div class="solution solution-not-show" v-else>
            <span>思考一下</span>
          </div>
        </transition>
      </div>
      <div class="footer">
        <el-button @click="showSolution = !showSolution">查看答案</el-button>
      </div>
    </div>
    <div class="arrow" v-if="cardInfo.questions.length != 0" @click="changeQuestion('pre')">
      <el-icon><component :is="$icon['ArrowRightBold']" /></el-icon>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, inject, watch, onMounted } from 'vue'
export default {
  name: 'CardFoldInfo',
}
</script>
<script lang="ts" setup>
import BaseMdEditor from '@/components/utils/md_editor.vue'
const cardInfo = inject('cardInfo')
const questionIndex = inject('questionIndex')
const showIndex = ref<number>(0)
const showSolution = ref<boolean>(false)
const difficultyLevel = ['简单', '普通', '较难']
const difficultyTag = ['success', 'warning', 'danger']
watch(
  cardInfo,
  (newV, oldV) => {
    showSolution.value = false
  },
  {
    immediate: true,
  }
)
onMounted(() => {
  showIndex.value = questionIndex.value
  showSolution.value = false
})
// 难度：{{ difficultyLevel[cardInfo.questions[showIndex].difficulty] }}
const changeQuestion = (type: string) => {
  if (type === 'pre') {
    showIndex.value = showIndex.value == 0 ? cardInfo.value.questions.length - 1 : showIndex.value - 1
  } else {
    showIndex.value = showIndex.value == cardInfo.value.questions.length - 1 ? 0 : showIndex.value + 1
  }
  showSolution.value = false
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  transition: height 5s linear;
  .arrow {
    width: 10%;
    text-align: center;
    height: 100%;
    padding-top: 20%;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }
  .body-container {
    width: 80%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    .question-container {
      position: relative;
      height: 180px;
      width: 100%;
      box-shadow: 0px -12px 32px 2px rgba(0, 0, 0, 0.08), 0px 8px 12px 2px rgba(0, 0, 0, 0.04);
      padding: 10px;
      text-align: center;
      font-size: 18px;
      .question {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span {
          text-align: initial;
          text-indent: 2ch;
          user-select: none;
          padding: 0 10px;
        }
      }
    }

    .solution-container {
      margin-top: 5px;
      background-color: rgba(0, 0, 0, 0.04);
      width: 100%;
      height: 400px;
      position: relative;
      box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.08), 0px 8px 12px 2px rgba(0, 0, 0, 0.04);
      .solution {
        position: absolute;
        left: 0;
        top: 0;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        padding: 10px;
        overflow-y: auto;
        background-color: #ebeef5;
        font-size: 15px;
      }
      .solution-not-show {
        text-align: center;
        overflow-y: hidden;
        span {
          font-size: 18px;
          font-weight: 600;
          color: #909399;
          line-height: 400px;
          user-select: none;
        }
      }
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      height: 50px;
      width: 100%;
    }
  }
}
.question-active-enter-from {
  transform: scale(0);
  opacity: 0;
}
.question-active-enter-to {
  transform: scale(1);
  opacity: 1;
}
.question-active-enter-active,
.question-active-leave-active {
  transition: all 0.5s linear;
}
.question-active-leave {
  transform: scale(1);
  opacity: 1;
}
.question-active-leave-to {
  transform: scale(0);
  opacity: 0;
}

.solution-active-enter-from {
  transform: rotateY(-180deg);
  transform-origin: 0;
  opacity: 0.5;
}
.solution-active-enter-to {
  opacity: 1;
  transform-origin: 0;
  transform: rotateY(0deg);
}
.solution-active-enter-active,
.solution-active-leave-active {
  transition: all 0.5s linear;
}
.solution-active-leave {
  opacity: 1;
}
.solution-active-leave-to {
  opacity: 0;
}
</style>
