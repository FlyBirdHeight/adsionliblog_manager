<template>
  <transition
    :appear="runningItem"
    :type="props.type"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    :css="false"
  >
    <slot></slot>
  </transition>
</template>
<script lang="ts" setup>
import { ref, defineProps, computed, watch, reactive, onMounted } from 'vue'
import BackIn from './content_lib/backIn'
import Opacity from './content_lib/opacity'
import FlyInLeft from './content_lib/fly_left'
import FlyInDown from './content_lib/fly_down';
const props = defineProps({
  type: {
    type: String,
    default: 'transition',
  },
  duration: {
    type: Number,
    default: 1500,
  },
  animate: {
    type: String,
    default: 'back-in',
  },
  runningItem: {
    type: Boolean,
    default: false,
  },
})
const animateList = {
  'back-in': BackIn,
  opacity: Opacity,
  'fly-left': FlyInLeft,
  'fly-down': FlyInDown
}
const useAnimate = ref(new BackIn())
onMounted(() => {
  useAnimate.value = (() => {
    console.log(typeof props.animate);
    // let Obj = animateList[props.animate]
    return null;
    // return new Obj(props.duration)
  })()
})
const beforeEnter = (el: any) => {
  if(!useAnimate.value) return;
  useAnimate.value.beforeEnter(el)
}
const enter = (el: any, done: any) => {
  if(!useAnimate.value) {
    done();
    return;
  }
  useAnimate.value.enter(el, done)
}
const afterEnter = (el: any) => {
  if(!useAnimate.value) return;
  useAnimate.value.afterEnter(el)
}
const beforeLeave = (el: any) => {
  if(!useAnimate.value) return;
  useAnimate.value.beforeLeave(el)
}
const leave = (el: any, done: any) => {
  if(!useAnimate.value) {
    done();
    return;
  }
  useAnimate.value.leave(el, done)
}
const afterLeave = (el: any) => {
  if(!useAnimate.value) return;
  useAnimate.value.afterLeave(el)
}
</script>
<style lang="scss" scoped></style>
