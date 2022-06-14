<template>
  <div class="edit-font">
    <div class="font-box">
      <div class="subLabel" style="width: 100%">通用配置：</div>
      <div class="checkbox-button-group">
        <el-checkbox-button v-model="fontStyle.weight" :true-label="'bolder'" :false-label="'400'">
          <icon-font class="edit-icon" :icon="'bold'" />
        </el-checkbox-button>
        <el-checkbox-button v-model="fontStyle.style" :true-label="'italic'" :false-label="'normal'">
          <icon-font class="edit-icon" :icon="'italic'" />
        </el-checkbox-button>
      </div>
      <el-radio-group class="radio-button-group" v-model="fontStyle.align">
        <el-radio-button :label="'left'"><icon-font class="edit-icon" :icon="'align-left'" /></el-radio-button>
        <el-radio-button :label="'center'"><icon-font class="edit-icon" :icon="'align-center'" /></el-radio-button>
        <el-radio-button :label="'right'"><icon-font class="edit-icon" :icon="'align-right'" /></el-radio-button>
      </el-radio-group>
    </div>
    <div class="font-style">
      <div class="subLabel">文字样式:</div>
      <div class="select-family">
        <el-select v-model="fontStyle.family" placeholder="选取字体">
          <el-option v-for="family in fontFamilyData" :value="family.family" :label="family.label">
            <span :style="{ fontFamily: family.family }">字体-font-123</span>
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, inject, watch, defineEmits } from 'vue'
import { fontFamilyList } from '@/modules/person/presentation/text/text'
export default {
  name: 'EditFont',
}
</script>
<script lang="ts" setup>
const emit = defineEmits(['changeFont'])
const fontStyle = inject('fontStyle')
const fontFamilyData = ref(fontFamilyList)
watch(fontStyle, (newV, oldV) => {
  emit('changeFont', fontStyle)
})
</script>
<style lang="scss" scoped>
.edit-font {
  margin-bottom: 10px;
  .font-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;
    .subLabel {
      @include subHeader();
    }
    .radio-button-group {
      margin-left: 5px;
    }
  }
  .font-style {
    margin-top: 5px;
    padding: 5px;
    .subLabel {
      @include subHeader();
    }
    .select-family {
      text-align: center;
    }
  }
}
</style>
