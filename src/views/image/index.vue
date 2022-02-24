<template>
  <h1 style="color: red">image</h1>
  <!-- <el-button @click="changeInfo">修改msg</el-button>
  <el-button @click="changeWifeInfo">修改msg的wife</el-button>
  <div>info: {{ info }}</div>
  <div>
    {{ msg }}
  </div> -->
  <fieldset>
    <legend>名字</legend>
    <el-form ref="formRef" :model="name" label-width="50px">
      <el-form-item label="姓氏">
        <el-input v-model="name.first" placeholder="Please input" clearable />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="name.second" placeholder="Please input" clearable />
      </el-form-item>
    </el-form>
  </fieldset>
  <fieldset>
    <legend>组合后结果：</legend>
    <el-input v-model="fullName" placeholder="组合后的名称" clearable=""></el-input>
  </fieldset>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, watch, watchEffect, computed } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'
export default defineComponent({
  setup() {
    const name = reactive({
      first: '李',
      second: '二狗',
    })
    const fullName = computed({
      get: () => name.first + '_' + name.second,
      set: (val) => {
        let data = val.split('_')
        console.log(data)
        name.first = data[0]
        name.second = data[1]
      },
    })

    return {
      name,
      fullName,
    }
  }
})
</script>
<style lang="scss"></style>
