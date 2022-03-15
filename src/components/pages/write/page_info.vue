<template>
  <div class="page-info">
    <div class="page-info-grid">
      <div class="category flex">
        <div style="width: 15%">
          <span>分类:</span>
        </div>
        <el-select
          v-model="info.category"
          style="width: 80%; flex-shrink: 0"
          multiple
          filterable
          default-first-option
          :reserve-keyword="false"
          placeholder="选择文章分类"
        >
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="tag flex">
        <div style="width: 15%">
          <span>标签:</span>
        </div>
        <el-select
          v-model="info.tag"
          style="width: 80%; flex-shrink: 0"
          multiple
          filterable
          default-first-option
          :reserve-keyword="false"
          placeholder="选择文章分类"
        >
          <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
      <div class="head-image flex">
        <div style="width: 15%"><span>头图地址:</span></div>
        <el-autocomplete
          style="width: 80%; flex-shrink: 0"
          v-model="info.headImage"
          :fetch-suggestions="querySearchAsync"
          placeholder="填入需要使用的头图地址或已存在图片名称进行筛查"
          @select="handleSelect"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PageInfo',
}
</script>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, defineProps, defineEmits } from 'vue'
import { setup } from 'vue-class-component';
interface InfoData {
  tag: Array<string>
  headImage: string
  category: Array<string>
}
interface ListData {
  label: string
  value: string
}
interface LinkItem {
  value: string
  link: string
}
const props = defineProps({
  sendData: Boolean,
})
const emit = defineEmits(['infoGet'])
let infoData: InfoData = {
  tag: [],
  headImage: '',
  category: [],
}
const info = reactive(infoData)
const categoryList = ref<Array<ListData>>([])
const tagList = ref<Array<ListData>>([])
//@TODO 用于头文件图片输入框查找,需要接入到后端去
const links = [
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element', link: 'https://github.com/ElemeFE/element' },
  { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
  { value: 'babel', link: 'https://github.com/babel/babel' },
]
let timeout: any
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString ? links.filter(createFilter(queryString)) : links
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb(results)
  }, 500)
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const handleSelect = (item: LinkItem) => {
  console.log(item)
}
//@TODO 远程搜索结束
const infoSubmit = () => {
  emit('infoGet', info)
}

watch(
  () => props.sendData,
  (newV, oldV) => {
    infoSubmit()
  }
)
</script>
<style lang="scss" scoped>
.page-info {
  margin-top: 2rem;
  border: 2px dashed rgba(229, 231, 235, 0.8);
  border-radius: 5px;
  padding: 0.75em;
  align-items: center;
  .page-info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    grid-template-rows: repeat(2, minmax(0px, 1fr));
    grid-gap: 10px;
    .category {
      justify-content: center;
      align-items: center;
      span {
        margin-right: 20px;
        float: right;
      }
    }
    .tag {
      justify-content: flex-start;
      align-items: center;
      span {
        margin-right: 20px;
        float: right;
      }
    }
    .head-image {
      justify-content: center;
      align-items: center;
      span {
        margin-right: 20px;
        float: right;
      }
    }
  }
}
</style>
