<template>
  <div>toolbar</div>
  <!-- <el-button @click="changeName">改变名称</el-button> -->
</template>
<script lang="ts">
import { ref, defineComponent, reactive, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
export default defineComponent({
  name: 'toolbar',
//   setup() {
//     const msg01 = reactive({
//       name: 'adsionli',
//     })
//     console.log(msg01.name)
//     watch(() => msg01.name, (oldV: string, newV: string) => {
//       console.log('name is change watch:', oldV, newV)
//     })
//     const changeName = function () {
//       console.log('changeName')
//       msg01.name += 'shirley'
//     }
//     return {
//       msg01,
//       changeName,
//     }
//   },
})
</script>
<style lang="scss"></style>
