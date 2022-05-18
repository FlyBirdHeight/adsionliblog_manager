<template>
  <div class="table-toolbar">
    <el-button v-show="showDisplay" type="primary" style="margin-right: 5px"> 隐藏列表 </el-button>
    <el-dropdown trigger="click" :hide-on-click="false" placement="right">
      <el-button type="success">设置列表展示</el-button>
      <template #dropdown>
        <!-- dropdown-menu是最后的存放区域 -->
        <el-dropdown-menu v-if="columnList.length != 0" @drop="dragDrop($event)">
          <!-- dropdown-item是可拖拽区域 -->
          <el-dropdown-item
            v-for="(column, index) of columnList"
            draggable="true"
            @dragstart.native="dragStart($event, column)"
            @dragenter="dragEnter($event, column)"
            @dragover.prevent="dragOver($event, column)"
          >
            <div class="column-info">
              <div class="column-info_item">
                <el-checkbox v-model="column.visiable" @change="changeVisible(column)" size="small" />
              </div>
              <div class="column-info_item">{{ column.label }}</div>
              <div class="column-info_item">
                <el-checkbox-button @change="changeFixed(column, 'left')" v-model="column.left" size="small"
                  >左固定</el-checkbox-button
                >
              </div>
              <div class="column-info_item">
                <el-checkbox-button @change="changeFixed(column, 'right')" v-model="column.right" size="small"
                  >右固定</el-checkbox-button
                >
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
export default {
  name: 'TableColumnSetting',
}
</script>
<script lang="ts" setup>
import { ref, inject, defineEmits, defineProps, watch, nextTick } from 'vue'
const props = defineProps<{
  showDisplay: boolean
}>()
const emit = defineEmits(['changeColumn'])
const table = inject('table')
const columnList = ref([])
nextTick(() => {
  table.value.columns.forEach((v, i) => {
    columnList.value[i] = {}
    for (let key of Reflect.ownKeys(v)) {
      columnList.value[i][key] = v[key]
    }
    columnList.value[i].left = false
    columnList.value[i].right = false
  })
})
/**
 * @method changeVisible 修改列表显示状态
 * @param {*} column 修改的列
 */
const changeVisible = (column) => {
  emit('changeColumn', 'updateVisiable', columnList.value)
}
/**
 * @method changeFixed 列数据fixed属性改变
 */
const changeFixed = (column, type) => {
  if (type === 'right' && column.right) {
    column.left = false
    column.fixed = 'right'
  } else if (type === 'left' && column.left) {
    column.right = false
    column.fixed = 'left'
  } else if (!column.left && !column.right) {
    column.fixed = undefined
  }
  emit('changeColumn', 'updateFixed', columnList.value)
}
//NOTE:下面的这些代码是拖拽的实现代码
const dragInfo = ref(null)
const dragEnterData = ref(null)
/**
 * @method dragStart 开始拖拽，我们需要在这个时候记录一下拖拽的内容是哪一个，好对之后进行处理
 */
const dragStart = (event, column) => {
  dragInfo.value = column
}
/**
 * @method dragEnter 拖拽时进入了哪一个元素中，通过dragEnter完成相关设置的回调信息
 */
const dragEnter = (event, column) => {
  dragEnterData.value = column
}
const dragOver = (event, column) => {
  //NOTE: 在拖拽事件时，over代表拖拽还在进行还未结束，所以还应该继续处理，让事件继续传播
  event.preventDefault()
}
const dragDrop = (event) => {
  //NOTE: 停止传播，因为这个时候已经drop了，代表已经放好位置了，就不需要继续了，直接中断拖拽事件就可以了
  if (event.stopPropagation) {
    event.stopPropagation()
  }
  dragEnterData.value = null
  dragInfo.value = null
}
watch(dragEnterData, (newV, oldV) => {
  if (!newV || newV.prop === dragInfo.value.prop) {
    return
  } else {
    let index = columnList.value.findIndex((v) => {
      return v.prop == newV.prop
    })
    let oldIndex = columnList.value.findIndex((v) => {
      return v.prop == dragInfo.value.prop
    })
    let t = columnList.value[oldIndex]
    columnList.value[oldIndex] = columnList.value[index]
    columnList.value[index] = t
    emit('changeColumn', 'changePath', columnList.value)
  }
})
</script>
<style lang="scss" scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.column-info {
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .column-info_checkbox-group {
    display: flex;
  }
  .column-info_item {
    margin: 0 5px;
  }
}
</style>
