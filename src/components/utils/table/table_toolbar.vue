<template>
  <div class="table-toolbar">
    <el-dropdown trigger="click" :hide-on-click="false" placement="top">
      <el-button type="primary">设置列表展示</el-button>
      <template #dropdown>
        <el-dropdown-menu v-if="columnList.length != 0">
          <el-dropdown-item v-for="(column, index) of columnList">
            <div
              class="column-info"
              draggable="true"
              @dragstart="dragStart($event, column)"
              @dragend="dragEnd($event, column)"
              @dragenter="dragEnter($event, column)"
            >
              <div class="column-info_item">
                <el-checkbox v-model="column.visiable" size="small" />
              </div>
              <div class="column-info_item">{{ column.prop }}</div>
              <div class="column-info_item"><el-button size="small">左固定</el-button></div>
              <div class="column-info_item"><el-button size="small">右固定</el-button></div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button type="primary" style="margin-left: 5px"> 隐藏列表 </el-button>
  </div>
</template>
<script lang="ts">
export default {
  name: 'TableColumnSetting',
}
</script>
<script lang="ts" setup>
import { ref, inject, defineEmits, defineProps, watch, nextTick } from 'vue'
const props = defineProps()
const emit = defineEmits(['changeColumn'])
const table = inject('table')
const columnList = ref([])
nextTick(() => {
  table.value.columns.forEach((v, i) => {
    columnList.value[i] = {}
    for (let key of Reflect.ownKeys(v)) {
      columnList.value[i][key] = v[key]
    }
  })
})
const dragInfo = ref(null)
const dragEnterData = ref(null)
const dragEndData = ref(null)
/**
 * @method dragStart 开始拖拽，我们需要在这个时候记录一下拖拽的内容是哪一个，好对之后进行处理
 */
const dragStart = (event, column) => {
  dragInfo.value = column
}
/**
 * @method dragEnd 拖拽结束，确定一下最终的位置在什么地方，然后就可以返回回调，调整数组位置或者其他动作
 */
const dragEnd = (event, column) => {
//   console.log('end:', column)
  dragEndData.value = column
}
/**
 * @method dragEnter 拖拽时进入了哪一个元素中，通过dragEnter完成相关设置的回调信息
 */
const dragEnter = (event, column) => {
//   console.log('enter:', column)
  dragEnterData.value = column
}
watch(dragEnterData, (newV, oldV) => {
    if(newV.prop === dragInfo.value.prop){
        return;
    }else {
        let index = columnList.value.findIndex((v) => {
            return v.prop == newV.prop
        })
        let oldIndex = columnList.value.findIndex((v) => {
            return v.prop == dragInfo.value.prop
        })
        let t = columnList.value[oldIndex];
        columnList.value[oldIndex] = columnList.value[index];
        columnList.value[index] = t;
        emit('changeColumn', 'changePath', columnList.value)
        console.log(index);
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
  .column-info_item {
    margin: 0 5px;
  }
}
</style>
