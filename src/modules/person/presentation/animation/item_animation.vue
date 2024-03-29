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
    mode="out-in"
  >
    <slot></slot>
  </transition>
</template>
<script lang="ts" setup>
import { ref, defineProps, computed, watch, reactive, onMounted } from 'vue'
import Opacity from './content_lib/opacity'
import Fly from './content_lib/fly'
import OpenUp from './content_lib/openUp';
import Scale from './content_lib/scale';
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
    default: 'fly',
  },
  runningItem: {
    type: Boolean,
    default: false,
  },
})
const animateList = {
  opacity: Opacity,
  fly: Fly,
  openUp: OpenUp,
  scale: Scale
}
const useAnimate = ref(null)
const needAttribute = ['fly', 'scale', 'openUp']
onMounted(() => {
  useAnimate.value = (() => {
    if (typeof props.animate !== 'string') {
      return setAnimate(props.animate)
    } else {
      let Obj = animateList[props.animate]
      return new Obj(props.duration)
    }
  })()
})
/**
 * @method setAnimate 负责控件内容动画部分的组装
 * @param {{in: Object, out: Object}} animate 动画内容
 */
const setAnimate = (animateInfo) => {
  let enter = animateInfo.in
  let leave = animateInfo.out
  let res = new Object({
    beforeEnter: null,
    enter: null,
    afterEnter: null,
    beforeLeave: null,
    leave: null,
    afterLeave: null,
  })
  if (enter.type != '') {
    let type = enter.type.split('-')[0]
    let Obj = animateList[type]
    let enterObj = new Obj(enter.time)
    if (needAttribute.includes(type)) {
      enterObj.setAttribute('in', { speed: enter.speed, attribute: enter.info.attribute })
    } else {
      enterObj.setAttribute('in', { speed: enter.speed })
    }
    res.beforeEnter = enterObj.beforeEnter.bind(enterObj)
    res.enter = enterObj.enter.bind(enterObj)
    res.afterEnter = enterObj.afterEnter.bind(enterObj)
  }
  if (leave.type != '') {
    let type = leave.type.split('-')[0]
    let Obj = animateList[type]
    let leaveObj = new Obj(leave.time)
    if (needAttribute.includes(type)) {
      leaveObj.setAttribute('out', { speed: leave.speed, attribute: leave.info.attribute })
    } else {
      leaveObj.setAttribute('out', { speed: enter.speed })
    }
    res.beforeLeave = leaveObj.beforeLeave.bind(leaveObj)
    res.leave = leaveObj.leave.bind(leaveObj)
    res.afterLeave = leaveObj.afterLeave.bind(leaveObj)
  }
  return res
}

const beforeEnter = (el: any) => {
  if (!useAnimate.value) return
  if (!useAnimate.value.beforeEnter) return
  useAnimate.value.beforeEnter(el)
}
const enter = (el: any, done: any) => {
  if (!useAnimate.value) {
    done()
    return
  }
  if (!useAnimate.value.enter) {
    done()
    return
  }
  useAnimate.value.enter(el, done)
}
const afterEnter = (el: any) => {
  if (!useAnimate.value) return
  if (!useAnimate.value.afterEnter) return
  useAnimate.value.afterEnter(el)
}
const beforeLeave = (el: any) => {
  if (!useAnimate.value) return
  if (!useAnimate.value.beforeLeave) return
  useAnimate.value.beforeLeave(el)
}
const leave = (el: any, done: any) => {
  if (!useAnimate.value) {
    done()
    return
  }
  if (!useAnimate.value.leave) {
    done()
    return
  }
  useAnimate.value.leave(el, done)
}
const afterLeave = (el: any) => {
  if (!useAnimate.value) return
  if (!useAnimate.value.afterLeave) return
  useAnimate.value.afterLeave(el)
}
</script>
<style lang="scss" scoped></style>
