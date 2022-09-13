<template>
  <div class="animate-setting">
    <div class="setting-trigger">
      <span class="label">触发:</span>
      <el-select v-model="trigger" :disabled="animateType === ''">
        <el-option v-for="item in triggerList" :key="item.value" :label="item.label" :value="item.value">
          <span style="float: left; margin-right: 10px">
            <el-icon><component :is="$icon[item.icon]" /></el-icon>
          </span>
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="setting-attribute">
      <span class="label">属性:{{attribute}}</span>
      <el-select v-model="attribute" :disabled="animateType === '' || infoList.length === 0" placeholder="选择动画属性">
        <el-option v-for="info in infoList" :key="info.value" :label="info.label" :value="info.value" />
      </el-select>
    </div>
    <div class="setting-time">
      <span class="label">速度:</span>
      <el-select v-model="time" :disabled="animateType === ''" placeholder="选择动画速度">
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
import { ref, defineProps, defineEmits, watch, reactive } from 'vue'
import { useModel } from '../hooks/useModel'
import { AnimateInfo } from '../data/item_animate'
const props = defineProps({
  trigger: String,
  attribute: String,
  time: Number,
  animateType: String,
  animate: String,
})
const emit = defineEmits(['update:trigger', 'update:attribute', 'update:time'])
const trigger = useModel(props, 'trigger')
const attribute = useModel(props, 'attribute')
const time = useModel(props, 'time')
const infoList = ref([])
const triggerList = TriggerList
const timeList = TimeList
const animateInfo = AnimateInfo
watch(
  () => props.animate,
  (newV: string) => {
    if (newV === '') {
      return
    }
    let type = newV.split('-')[0]
    if (Reflect.has(animateInfo, type)) {
      infoList.value = animateInfo[type]
    } else {
      infoList.value = []
    }
  }
)
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
