<template>
  <transition
    :appear="runningItem"
    :type="props.type"
    @beforeEnter="props.animate.beforeEnter"
    @enter="props.animate.enter"
    @after-enter="props.animate.afterEnter"
    @before-leave="props.animate.beforeLeave"
    @leave="props.animate.leave"
    @after-leave="props.animate.afterLeave"
    :css="false"
  >
    <slot></slot>
  </transition>
</template>
<script lang="ts">
import BackIn from './content_lib/backIn'
import { ref, defineProps, computed, watch, reactive, onMounted } from 'vue'
export default {
  name: 'ItemAnimation',
}
</script>
<script lang="ts" setup>
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
    default: () => {
      return new BackIn()
    },
  },
  runningItem: {
    type: Boolean,
    default: false,
  },
})
onMounted(() => {
  console.log(props.animate)
})
</script>
<style lang="scss" scoped></style>
