<template>
  <el-table ref="categoryTableMultip" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column type="expand">
      <template #default="props">
        <p>State: {{ props.row.state }}</p>
        <p>City: {{ props.row.city }}</p>
        <p>Address: {{ props.row.address }}</p>
        <p>Zip: {{ props.row.zip }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Name" prop="name" />
  </el-table>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onMounted } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { CategoryList, getCategoryList } from '@/plugin/page/category_tag/category_tag'
export default defineComponent({
  name: 'Category',
  setup(props, context) {
    const categoryTableMultip = ref<InstanceType<typeof ElTable>>()
    const categorySelectdValue = ref<CategoryList[]>([])
    const page = ref<number>(1)
    const count = ref<number>(20)
    const handleSelectionChange = (val: CategoryList[]) => {
      categorySelectdValue.value = val
    }
    onMounted(() => {
      getCategoryList(page.value, count.value)
        .then((res) => {
          // console.log(res.data)
        })
        .catch((error) => {
          console.log(error)
        })
    })
    const tableData = ref<Array<CategoryList>>([])

    return {
      tableData,
      categoryTableMultip,
      handleSelectionChange,
      categorySelectdValue,
    }
  },
})
</script>
<style lang="scss"></style>
