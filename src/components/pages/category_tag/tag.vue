<template>
  <h1>标签管理</h1>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onMounted } from 'vue';
import { Options, Vue } from 'vue-class-component'
export default defineComponent({
  name: 'Tag',
  setup(props, context) {
      onMounted(() => {
          console.log('create')
      })
  },
})
</script>
<style lang="scss"></style>
