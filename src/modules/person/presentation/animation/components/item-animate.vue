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
            v-model:time="animateSetting.time"
          ></animate-setting-item>
        </div>
        <item-animate-list></item-animate-list>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ItemAnimate',
}
</script>
<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import AnimateSelect from './animate-select.vue'
import AnimateSettingItem from './animate-setting.vue'
import ItemAnimateList from './item-animate-list.vue'
const itemChoice = ref<boolean>(true)
const checkData = ref([])
const animateSetting = reactive({
  trigger: '',
  attribute: '',
  time: null,
})
watch(checkData, (newV: any, oldV: any) => {
  console.log(newV)
})
watch(animateSetting, (newV) => {
  console.log(newV)
})
</script>
<style lang="scss" scoped>
@import '../scss/open_show.scss';
@import './item-animate.scss';
</style>
