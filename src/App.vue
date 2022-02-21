
<template>
  <toolbar></toolbar>
  <menu></menu>
  <!-- 组件模板不需要最外层的根标签包裹了 -->
  <div id="nav">
    <router-link to="/">Home</router-link> |
  </div>
  <router-view/>
  <bottom></bottom>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Options } from 'vue-class-component';
import toolbar from "./components/layout/toolbar.vue"
import menu from "./components/layout/menu.vue"
import bottom from "./components/layout/bottom.vue"
@Options({
  components: {
    toolbar,
    menu,
    bottom
  }
})
export default defineComponent({

})
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
