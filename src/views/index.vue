<template>
  <h1>
    {{ title }}
  </h1>
  <h1>{{ count }}</h1>
  <el-button @click="addCount">执行count++方法</el-button>
  <div>
      {{user}}
  </div>
  <el-button @click="changeUser">改变User中的内容</el-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const title = 'adsionli admin'
    //html模板中是不需要使用.value的，因为它会自动调用value，返回的类型是一个Ref类型
    const count: any = ref<number>(0)
    function addCount(): void {
      console.log('add')

      count.value++
    }
    const info = {
      name: 'adsionli',
      age: 26,
      wife: {
        name: 'shirley',
        age: 26,
      },
    }
    //也就是说使用reactive可以将对象数据转换成响应式数据,但是如果是使用原对象且没有加上reactive修改的话是无效的，而且reactive返回的是一个Proxy对象
    const user = reactive<any>(info)
    function changeUser(){
        user.age = 18;
        user.sex = 'male'; 
    }

    return {
      title,
      count,
      addCount,
      user,
      changeUser
    }
  },
})
</script>

<style lang="scss"></style>
