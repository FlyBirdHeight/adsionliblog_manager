<template>
  <h1 style="color: red">image</h1>
  <!-- <el-button @click="changeInfo">修改msg</el-button>
  <el-button @click="changeWifeInfo">修改msg的wife</el-button>
  <div>info: {{ info }}</div>
  <div>
    {{ msg }}
  </div> -->
</template>
<script lang="ts">
import { ref, defineComponent, reactive, watch, watchEffect } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'
export default defineComponent({
  //   setup() {
  //     const msg = reactive({
  //       name: 'adsionli',
  //       age: 26,
  //       wife: {
  //         name: 'shirley',
  //         age: 26,
  //       },
  //     })
  //     watch(
  //       [() => msg.name, () => msg.age, () => msg.wife],
  //       (oldV, newV) => {
  //         console.log(oldV, newV)
  //       },
  //       { deep: true }
  //     )
  //     const info = ref('')
  //     const changeInfo = () => {
  //       msg.name += ' love shirley'
  //       msg.age += 1
  //       info.value = msg.name + '  ' + msg.age
  //     }
  //     const changeWifeInfo = () => {
  //       msg.wife.name += ' love adsionli'
  //       msg.wife.age += 1
  //     }
  //     return {
  //       changeWifeInfo,
  //       changeInfo,
  //       info,
  //       msg,
  //     }
  //   },
  setup() {
    const count = ref(0)
    const msg = reactive({
      name: 'adsionli',
      age: 26,
      wife: {
        name: 'shirley',
        age: 26,
      },
    })
    watchEffect(() => {
        console.log(count.value);
        console.log(msg.age)
    })
    // -> logs 0

    setTimeout(() => {
      count.value++;
      msg.age++;
      // -> logs 1
    }, 100)
  },
})
</script>
<style lang="scss"></style>
