<template>
  <div class="animate-setting">
    <div class="setting-trigger">
      <span class="label">触发:</span>
      <el-select v-model="trigger" placeholder="选择触发方式">
        <el-option v-for="item in triggerList" :key="item.value" :label="item.label" :value="item.value">
          <span style="float: left; margin-right: 10px">
            <el-icon><component :is="$icon[item.icon]" /></el-icon>
          </span>
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="setting-attribute">
      <span class="label">属性:</span>
      <el-select v-model="attribute" placeholder="选择动画属性"> </el-select>
    </div>
    <div class="setting-time">
      <span class="label">速度:</span>
      <el-select v-model="time" placeholder="选择动画速度">
        <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>
<script lang="ts">
import { TriggerList, TimeList } from '../data/item_animate_attribute'
export default {
  name: 'AnimateSettingItem',
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useModel } from '../hooks/useModel'
const props = defineProps({
  trigger: String,
  attribute: String,
  time: Number,
})
const emit = defineEmits(['update:trigger', 'update:attribute', 'update:time'])
const trigger = useModel(props, 'trigger')
const attribute = useModel(props, 'attribute')
const time = useModel(props, 'time')
const triggerList = TriggerList
const timeList = TimeList
</script>
<style lang="scss" scoped>
.animate-setting {
  width: 100%;
  .setting-trigger,
  .setting-attribute,
  .setting-time {
    display: flex;
    justify-content: left;
    align-content: center;
    width: 100%;
    .label {
      text-align: right;
      font-size: 13px;
      font-weight: 400;
      width: 20%;
      height: 40px;
      margin: 5px 0;
      padding-right: 15px;
    }
  }
}
</style>
