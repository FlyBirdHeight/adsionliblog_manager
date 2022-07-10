<template>
  <transition
    :appear="runningItem"
    :type="props.type"
    @beforeEnter="props.animate.onBeforeEnter"
    @enter="props.animate.onEnter"
    @after-enter="props.animate.onAfterEnter"
    @enter-cancelled="props.animate.onEnterCancelled"
    @before-leave="props.animate.onBeforeLeave"
    @leave="props.animate.onLeave"
    @after-leave="props.animate.onAfterLeave"
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
      return BackIn
    },
  },
  runningItem: {
    type: Boolean,
    default: false
  }
})
onMounted(() => {
  console.log(props.animate)
})
</script>
<style lang="scss" scoped></style>
