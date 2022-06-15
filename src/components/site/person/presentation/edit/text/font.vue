<template>
  <div class="edit-font">
    <div class="font-box">
      <div class="subLabel" style="width: 100%">通用配置:</div>
      <div class="checkbox-button-group">
        <el-checkbox-button v-model="textStyle.font.weight" :true-label="'bolder'" :false-label="'400'">
          <icon-font class="edit-icon" :icon="'bold'" />
        </el-checkbox-button>
        <el-checkbox-button v-model="textStyle.font.style" :true-label="'italic'" :false-label="'normal'">
          <icon-font class="edit-icon" :icon="'italic'" />
        </el-checkbox-button>
      </div>
      <el-radio-group class="radio-button-group" v-model="textStyle.font.align">
        <el-radio-button :label="'left'"><icon-font class="edit-icon" :icon="'align-left'" /></el-radio-button>
        <el-radio-button :label="'center'"><icon-font class="edit-icon" :icon="'align-center'" /></el-radio-button>
        <el-radio-button :label="'right'"><icon-font class="edit-icon" :icon="'align-right'" /></el-radio-button>
      </el-radio-group>
    </div>
    <div class="font-style">
      <div class="subLabel">文字样式:</div>
      <div class="font-size">
        <div class="thridLabel">字体大小:</div>
        <el-input-number
          style="width: 100px"
          controls-position="right"
          label="%"
          v-model="textStyle.font.size"
          :min="12"
          :max="100"
          size="small"
        />
      </div>
      <div class="select-family">
        <div class="thridLabel">字体样式:</div>
        <el-select size="small" style="width: 100px" v-model="textStyle.font.family" placeholder="选取字体">
          <el-option v-for="family in fontFamilyData" :value="family.family" :label="family.label">
            <span :style="{ fontFamily: family.family }">字体-font-123</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="text-style">
      <div class="subLabel">字体配置:</div>
      <div class="decoration-setting">
        <el-checkbox
          v-model="textStyle.text.decoration.line"
          label="下划线"
          :true-label="'underline'"
          :false-label="'unset'"
          border
        />
        <el-color-picker
          v-if="textStyle.text.decoration.line == 'underline'"
          v-model="textStyle.text.decoration.color"
          show-alpha
        />
        <el-select
          v-if="textStyle.text.decoration.line == 'underline'"
          style="width: 100px"
          v-model="textStyle.text.decoration.style"
          placeholder="选取划线方式"
        >
          <el-option v-for="decoration in decorationStyle" :value="decoration.value" :label="decoration.label">
            <span :style="{ textDecorationLine: 'underline', textDecorationStyle: decoration.value }">{{
              decoration.label
            }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="color-style">
      <div class="subLabel">颜色相关设置:</div>
      <div class="font-color">
        <div class="thridLabel">字体颜色:</div>
        <el-color-picker v-model="textStyle.color" show-alpha />
      </div>
      <div class="background-color">
        <div class="thridLabel">背景颜色:</div>
        <el-color-picker v-model="textStyle.backgroundColor" show-alpha />
      </div>
      <div class="subLabel">边框设置:</div>
      <div class="border-show">
        <el-checkbox
          style="transform: translate(50%)"
          v-model="textStyle.border.set"
          label="边框"
          :true-label="'1px solid'"
          :false-label="'none'"
          border
          size="small"
        />
      </div>
      <div class="border-color">
        <div class="thridLabel">边框颜色:</div>
        <el-color-picker v-model="textStyle.border.color" show-alpha />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, inject, watch, defineEmits } from 'vue'
import { fontFamilyList, decorationStyle } from '@/modules/person/presentation/text/text'
export default {
  name: 'EditFont',
}
</script>
<script lang="ts" setup>
const textStyle = inject('textStyle')
const fontFamilyData = ref(fontFamilyList)
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
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .thridLabel {
        @include thridHeader();
        width: 80px;
        margin: 0 20px 0 10px;
      }
    }
    .font-size {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
      .thridLabel {
        @include thridHeader();
        width: 80px;
        margin: 0 20px 0 10px;
      }
    }
  }
  .text-style {
    margin-top: 5px;
    padding: 5px;
    .subLabel {
      @include subHeader();
    }
    .decoration-setting {
      margin-top: 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  .color-style {
    margin-top: 5px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .subLabel {
      @include subHeader();
      width: 100%;
      flex-shrink: 0;
    }
    .font-color,
    .background-color,
    .border-color,
    .border-show {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .thridLabel {
        @include thridHeader();
        margin: 0 20px;
      }
    }
  }
}
</style>
