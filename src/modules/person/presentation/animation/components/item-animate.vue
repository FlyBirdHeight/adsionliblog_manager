<template>
  <div class="item-animate">
    <div class="item-animate_label" style="cursor: pointer" @click.stop="itemChoice = !itemChoice">
      <span>控件动画:</span>
      <span style="float: right">
        <open-icon :change="itemChoice" />
      </span>
    </div>
    <transition name="open-show">
      <div v-if="itemChoice">
        <div class="item-animate_choice">
          <div class="animate-choice">
            <span>选择动画：</span>
            <animate-select v-model="checkData"></animate-select>
          </div>
          <div class="animate-setting">
            <span class="label">属性设置:</span>
          </div>
          <animate-setting-item
            v-model:trigger="animateSetting.trigger"
            v-model:attribute="animateSetting.attribute"
            v-model:time="animateSetting.speed"
            :animateType="animateSetting.task"
            :animate="animateSetting.type"
          ></animate-setting-item>
        </div>
      </div>
    </transition>
    <item-animate-list></item-animate-list>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import useActiveItem from '../hooks/useActiveItem'
export default {
  name: 'ItemAnimate',
}
</script>
<script lang="ts" setup>
import AnimateSelect from './animate-select.vue'
import AnimateSettingItem from './animate-setting.vue'
import ItemAnimateList from './item-animate-list.vue'
const itemChoice = ref<boolean>(true)
const animateInfo = useActiveItem(function (itemInfo: any) {
  return itemInfo.animate
})
const animateSet = reactive({
  in: {
    type: '',
    attribute: '',
    trigger: '',
    speed: 1,
  },
  out: {
    type: '',
    attribute: '',
    trigger: '',
    speed: 1,
  },
})
const checkData = ref([])
const animateSetting = reactive({
  task: '',
  type: '',
  trigger: 'click',
  attribute: '',
  speed: 1,
})
watch(animateInfo, (newV, oldV) => {
  if (newV) {
    console.log(newV)
  }
})

watch(checkData, (newV: any, oldV: any) => {
  if (newV[0] === 'in') {
    animateSet.in.type = newV[1]
  } else if (newV[0] === 'out') {
    animateSet.out.type = newV[1]
  }
  animateSetting.task = newV[0]
  animateSetting.type = newV[1]
  Object.assign(animateSetting, {
    trigger: 'click',
    attribute: '',
    speed: 1
  })
  console.log(animateSetting)
})
watch(animateSetting, (newV) => {
  if (newV.task === 'in') {
    Object.assign(animateSet.in, new Object(newV))
  } else if (newV.task === 'out') {
    Object.assign(animateSet.out, newV)
  }
})
</script>
<style lang="scss" scoped>
@import '../scss/open_show.scss';
@import './item-animate.scss';
</style>
