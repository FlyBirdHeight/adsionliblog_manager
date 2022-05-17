<template>
  <el-table class="base-table" ref="table">
    <children :key="key" />
  </el-table>
</template>
<script lang="ts">
export default {
  name: 'BaseTable',
}
</script>
<script lang="ts" setup>
import { defineExpose, readonly, useSlots, computed, reactive, ref, watch, cloneVNode } from 'vue'
//README:自定义组件，通过useSlots方法，拿到传入的slots内容，下面这些内容可以实现列的显隐、固定和排序
const slotsOrigin = useSlots()
const key = ref<number>(0)
/**
 * @method isElTableColumn 判断是否是table的列数据
 * @param {VNode} vnode 节点
 */
function isElTableColumn(vnode) {
  return (vnode.type as Component)?.name === 'ElTableColumn'
}
/**
 * @computed slots 负责computed监听slotsOrigin的变化，重新生成数据分类，
 * fixed-left, normal, fixed-right三种
 */
const slots = computed(() => {
  const main = [] // 第1类
  const left = [] // 第2类
  const other = [] // 第3类

  //README:通过对default方法的执行，可以获取到传入的slot的vnode，然后再对vnode中的props传入的fixed进行分类挂载
  slotsOrigin.default?.()?.forEach((vnode) => {
    if (isElTableColumn(vnode)) {
      // 是 el-table-column 组件
      const { prop, fixed } = vnode.props ?? {}
      // 存在 prop 属性，归第1类
      if (prop !== undefined) return main.push(vnode)
      // 不存在 prop 属性，但 fixed="left"，归第2类
      if (fixed === 'left') return left.push(vnode)
      return other.push(vnode)
    } else {
      vnode.children.forEach((cnode) => {
        if (isElTableColumn(cnode)) {
          // 是 el-table-column 组件
          const { prop, fixed } = cnode.props ?? {}
          // 存在 prop 属性，归第1类
          if (prop !== undefined) return main.push(cnode)
          // 不存在 prop 属性，但 fixed="left"，归第2类
          if (fixed === 'left') return left.push(cnode)
        }
        // 其他，归第4类
        other.push(cnode)
      })
    }
  })

  return {
    main,
    left,
    other,
  }
})
//README: 获取到列数据，用于之后的操作
const columns = reactive({
  slot: computed(() =>
    //继续注册一个响应事件，用computed可以在第一次就主动触发响应
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
        if (Array.isArray(props.fixed)) {
          props.fixed = props.fixed[0]
        }
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

/**
 * README: 再一次重构主要展示内容的column，将不显示的或是删除的列给清除掉，因为使用的是computed返回，所以是响应式的，reactive里面直接注册方法进去
 * NOTE: 为什么可以触发响应式，因为这里触发了Proxy.getter，所以可以响应式监听到，并调用响应栈，computed相当于注册入栈中了
 */
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
//NOTE: 这里就返回一个children就可以了，相当于是调用了render函数了
const children = () => [slots.value.left, refactorSlot.value, slots.value.other]
//NOTE: 监听响应式数据是否发生改变，如果发生改变key改变引发节点重新渲染
watch(refactorSlot, () => (key.value += 1))

const table = ref()
defineExpose({
  table,
  columns: computed(() => readonly(columns.render)),
  updateColumns(value) {
    columns.storage = value
  },
})
</script>
<style lang="scss">
.base-table {
  td.el-table__cell div {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    max-height: 70px !important;
  }
}
</style>
