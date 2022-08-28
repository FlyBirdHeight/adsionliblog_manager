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
        <div class="item-animate_choice">123</div>
        <div class="item-animate_list">
          <div class="list-item"></div>
        </div>
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
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
const itemChoice = ref<boolean>(true)
</script>
<style lang="scss" scoped>
@import '../scss/open_show.scss';
@import './item-animate.scss';
</style>
