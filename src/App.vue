<template>
  <div class="container flex-vertical all-screen">
    <div class="container flex-horizontal">
      <left-menu></left-menu>
      <!-- 组件模板不需要最外层的根标签包裹了 -->
      <div class="container flex-vertical">
        <router-header></router-header>
        <div class="router-body">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'
import leftMenu from '@/components/layout/left_menu.vue'
import RouterHeader from '@/components/layout/header.vue'
@Options({
  components: {
    leftMenu,
    RouterHeader,
  },
})
export default class App extends Vue {
  setup() {
    const msg = 'adsionli-admin'

    return {
      msg,
    }
  }
}
</script>
<style></style>
