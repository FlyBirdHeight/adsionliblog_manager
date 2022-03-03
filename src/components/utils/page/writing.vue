<template>
  <el-form class="form-border" label-position="left" :model="data" label-width="80px">
    <el-form-item label="标题:">
      <el-input v-model="data.title" placeholder="请输入文章标题" />
    </el-form-item>
    <el-form-item label="副标题:">
      <el-input v-model="data.subTitle" placeholder="请输入文章副标题" />
    </el-form-item>
    <el-form-item label="文章介绍:">
      <el-input v-model="data.description" placeholder="请输入文章介绍" />
    </el-form-item>
    <el-form-item label="发布时间:">
      <el-date-picker style="width: 100%" v-model="data.writingDate" type="date" placeholder="选择发布日期" />
    </el-form-item>
  </el-form>
  <md-editor style="margin-top: 20px" preview-theme="github" v-model="data.page" />
</template>
<script lang="ts">
import { ref, defineComponent, reactive, computed, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
interface WritingForm {
  title: string
  subTitle: string
  description: string
  writingDate: string
  page: string
}
export default defineComponent({
  name: 'Writing',
  props: {
    sendData: Boolean,
  },
  components: {
    MdEditor,
  },
  emits: ['dataGet'],
  setup(props, context) {
    const form: WritingForm = {
      title: '',
      subTitle: '',
      description: '',
      writingDate: '',
      page: '',
    }
    const data = reactive(form)
    const dataGet = () => {
      context.emit('dataGet', data)
    }
    watch(
      () => props.sendData,
      (newV, oldV) => {
        if (newV) {
          dataGet()
        }
      }
    )
    return {
      data,
      dataGet,
    }
  },
})
</script>
<style lang="scss" scoped>
.form-border {
  border: 2px dashed rgba(229, 231, 235, 0.8);
  padding: 10px;
  border-radius: 5px;
}
</style>
