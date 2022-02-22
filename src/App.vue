<template>
  <toolbar></toolbar>
  <left></left>
  <!-- 组件模板不需要最外层的根标签包裹了 -->
  <router-view />
  <bottom></bottom>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'
import toolbar from './components/layout/toolbar.vue'
import left from './components/layout/left_menu.vue'
import bottom from './components/layout/bottom.vue'
@Options({
  components: {
    toolbar,
    left,
    bottom,
  },
})
export default class App extends Vue {
  setup() {
    const msg = "adsionli-admin";
    return {
      msg
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
