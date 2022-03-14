<template>
  <div class="toolbar">
    <div class="toolbar_menu">
      <el-button type="primary" class="none-border" :icon="buttonIcon" @click="changeStatus"></el-button>
    </div>
    <div class="toolbar_title">adsionli博客管理</div>
    <div class="toolbar_status">status</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, watchEffect } from 'vue'
import { Close, Fold } from '@element-plus/icons-vue'
import { State } from '@/store/index'
import { useStore } from 'vuex'
const {state: {menu}, getters, commit} = useStore<State>();
// console.log(state)
const buttonIcon: any = shallowRef(Close)
const showType = ref(true)
const changeStatus = () => {
  showType.value = !showType.value
  
}
watchEffect(() => {
  buttonIcon.value = showType.value ? Fold : Close
  commit('menu/SET_SHOW_MENU', showType.value);
})
</script>
<style lang="scss">
.toolbar .toolbar_menu {
  .none-border {
    border: 0;
    background-color: rgba(1, 1, 1, 0);
    color: #fff;
    font-size: 18px
  }
}
</style>
