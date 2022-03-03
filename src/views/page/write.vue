<template>
  <div class="page-write-header">
    <h2 class="header-title">文章发布</h2>
    <el-button color="#FF69B4" style="color: #fff" :icon="$icon['Promotion']" circle @click="sendPage"></el-button>
  </div>
  <writing :send-data="sendData" @dataGet="dataGet"></writing>
  <page-info :send-data="sendData" @infoGet="infoGet"></page-info>
</template>
<script lang="ts">
import Writing from '@/components/utils/page/writing.vue'
import PageInfo from '@/components/utils/page/page_info.vue'
import { ref, defineComponent, reactive, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
export default defineComponent({
  components: {
    Writing,
    PageInfo,
  },
  setup(props, context) {
    const sendData = ref(false)
    const dataReturn = ref(false)
    const infoReturn = ref(false)
    const pageData = reactive({
        info: null,
        data: null
    })
    const sendPage = () => {
      sendData.value = true
    }
    const dataGet = (val: any) => {
      pageData.data = val;
      dataReturn.value = true
    }
    const infoGet = (val: any) => {
      pageData.info = val;
      infoReturn.value = true
    }

    watch([infoReturn, dataReturn], (newV, oldV) => {
      if (newV[0] && newV[1]) {
        sendData.value = false
        infoReturn.value = false
        dataReturn.value = false
      }
    })

    return {
      sendPage,
      dataGet,
      infoGet,
      sendData,
    }
  },
})
</script>
<style lang="scss" scoped>
.page-write-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: inherit;
  }
}
</style>
