<template>
  <div class="container flex-vertical">
    <toolbar></toolbar>
    <div class="container flex-horizontal">
      <left-menu></left-menu>
      <!-- 组件模板不需要最外层的根标签包裹了 -->
      <div class="container flex-vertical">
        <div class="router-body">
          <router-view />
        </div>
        <bottom></bottom>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'
import toolbar from './components/layout/toolbar.vue'
import leftMenu from './components/layout/left_menu.vue'
import bottom from './components/layout/bottom.vue'
@Options({
  components: {
    toolbar,
    leftMenu,
    bottom,
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
<style>

</style>
