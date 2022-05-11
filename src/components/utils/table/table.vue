<template>
  <div class="public-table">
    <el-table
      :data="tableData"
      :border="tableConfig.border"
      :height="tableConfig.height"
      :size="tableConfig.size"
      :fit="tableConfig.fit"
      :show-header="tableConfig.showHeader"
      :highlight-current-row="tableConfig.highlightCurrentRow"
      :row-style="tableConfig.rowStyle"
    >
      <!-- <slot name="tableBody"> </slot> -->
      <children :key="key" />
    </el-table>
    <pagination
      v-if="usePagination"
      :totalSize="pageConfig.total"
      @setCurrentPage="changePageData"
      @setPageSize="changePageData"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'PublicTable',
}
</script>
<script lang="ts" setup>
import Pagination from '@/components/utils/pagination.vue'
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect, useSlots, cloneVNode } from 'vue'
import { PaginationReturn } from '../../../utils/pagination'
const props = defineProps({
  usePagination: {
    type: Boolean,
    default: true,
  },
  tableData: {
    type: Array,
    default: [],
  },
  pageConfig: {
    type: Object,
    default: {
      total: 0,
      page: 1,
      count: 10,
    },
  },
  tableConfig: {
    type: Object,
    default: {
      border: true,
      height: 600,
      size: 'medium',
      fit: false,
      showHeader: true,
      highlightCurrentRow: false,
      rowStyle: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    },
  },
})
const emit = defineEmits(['changePageConfig'])
const changePageData = (val: PaginationReturn) => {
  emit('changePageConfig', val)
}
//README:自定义组件，通过useSlots方法，拿到传入的slots内容，下面这些内容可以实现列的显隐、固定和排序
const slotsOrigin = useSlots()
const key = ref<number>(0)
function isElTableColumn(vnode) {
  return (vnode.type as Component)?.name === 'ElTableColumn'
}
const slots = computed(() => {
  const main = [] // 第1类
  const left = [] // 第2类
  const right = [] // 第3类
  const other = [] // 第4类

  //README:通过对default方法的执行，可以获取到传入的slot的vnode，然后再对vnode中的props传入的fixed进行分类挂载
  slotsOrigin.default?.()?.forEach((vnode) => {
    if (isElTableColumn(vnode)) {
      // 是 el-table-column 组件
      const { prop, fixed } = vnode.props ?? {}
      // 存在 prop 属性，归第1类
      if (prop !== undefined) return main.push(vnode)
      // 不存在 prop 属性，但 fixed="left"，归第2类
      if (fixed === 'left') return left.push(vnode)
      if (fixed === 'right') return right.push(vnode)
    }

    // 其他，归第4类
    other.push(vnode)
  })

  return {
    main,
    left,
    other,
    right,
  }
})
//README: 获取到列数据，用于之后的操作
const columns = reactive({
  slot: computed(() =>
    slots.value.main.map(({ props }) => ({
      prop: props.prop, // 标识
      label: props.label, // 列名称
      fixed: props.fixed, // 固定位置
      visiable: props.visiable ?? true, // 是否可见
    }))
  ),
  //storege可以用来动态设置需要展示的列内容
  storage: [],
  //最终渲染的时候需要使用的列数据
  render: computed(() => {
    const slot = [...columns.slot]
    const storage = [...columns.storage]

    const res = []
    storage.forEach((props) => {
      const index = slot.findIndex(({ prop }) => prop === props.prop)
      if (~index) {
        const propsFromSlot = slot[index]
        res.push({
          ...propsFromSlot, // 可能新增属性 所以用 slot 的数据打个底
          ...props,
        })
        slot.splice(index, 1) // storage 里不存在的列
      }
      // slot 中没有找到的 则会被过滤掉
    })
    res.push(...slot)

    return res
  }),
})
function updateColumns(value) {
  columns.storage = value
}
//README: 再一次重构主要展示内容的column，将不显示的或是删除的列给清除掉，因为使用的是computed返回，所以是响应式的，reactive里面直接注册方法进去
const refactorSlot = computed(() => {
  const { main } = slots.value
  const refactorySlot = []
  columns.render.forEach(({ prop, visiable, fixed }) => {
    // 设置为不可见的 则跳过（即不渲染）
    if (!visiable) return
    // 从 slots.main 中寻找对应 prop 的 VNode
    const vnode = main.find((vnode) => prop === vnode.props?.prop)
    if (!vnode) return
    // 克隆 VNode 并修改部分属性
    const cloned = cloneVNode(vnode, {
      fixed,
      // 这里可以根据需求 修改属性，非常灵活
    })
    refactorySlot.push(cloned)
  })
  return refactorySlot
})
const children = () => [slots.value.left, refactorSlot.value, slots.value.other, slots.value.right]
watch(refactorSlot, () => (key.value += 1))
</script>
<style lang="scss" scoped>
.public-table {
  margin-top: 50px;
}
</style>
