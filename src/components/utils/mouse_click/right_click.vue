<template>
  <ul
    class="right-click-menu-container"
    ref="rightMenuList"
    v-show="rightShow"
    :style="{ left: `${showPosition.left}px`, top: `${showPosition.top}px` }"
  >
    <slot name="menuList"></slot>
  </ul>
</template>
<script lang="ts">
import { inject, onMounted, defineEmits } from 'vue'
export default {
  name: 'MouseRightClickMenu',
}
</script>
<script lang="ts" setup>
const emit = defineEmits(['closeRightList']);
const rightShow = inject('showRight')
const showPosition = inject('showPosition')
const displayRight = () =>
  document.addEventListener('click', (e) => {
    if (e.target.className !== 'right_menu_list') {
      emit('closeRightList')
    }
    document.removeEventListener('click', this, true)
  })
onMounted(() => {
  displayRight()
})
</script>
<style lang="scss" scoped>
.right-click-menu-container {
  position: fixed;
  z-index: 9999;
  height: auto;
  list-style: none;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding-inline: initial;
  margin-block: revert;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
}
</style>
