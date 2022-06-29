<template>
  <div class="edit-font">
    <div class="font-box">
      <div class="subLabel" style="width: 100%">通用配置:</div>
      <div class="checkbox-button-group">
        <el-checkbox-button
          v-model="textStyle.font.weight"
          @change="handleText('font_weight')"
          :true-label="'bolder'"
          :false-label="'400'"
        >
          <icon-font class="edit-icon" :icon="'bold'" />
        </el-checkbox-button>
        <el-checkbox-button
          v-model="textStyle.font.style"
          @change="handleText('font_style')"
          :true-label="'italic'"
          :false-label="'normal'"
        >
          <icon-font class="edit-icon" :icon="'italic'" />
        </el-checkbox-button>
      </div>
      <el-radio-group class="radio-button-group" @change="handleText('font_align')" v-model="textStyle.font.align">
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
          @change="handleText('font_size')"
        />
      </div>
      <div class="select-family">
        <div class="thridLabel">字体样式:</div>
        <el-select
          size="small"
          style="width: 100px"
          v-model="textStyle.font.family"
          placeholder="选取字体"
          @change="handleText('font_family')"
        >
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
          @change="handleText('text_decoration_line')"
        />
        <el-color-picker
          v-if="textStyle.text.decoration.line == 'underline'"
          v-model="textStyle.text.decoration.color"
          @change="handleText('text_decoration_color')"
          show-alpha
        />
        <el-select
          v-if="textStyle.text.decoration.line == 'underline'"
          style="width: 100px"
          v-model="textStyle.text.decoration.style"
          @change="handleText('text_decoration_style')"
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
        <el-color-picker @change="handleText('color')" v-model="textStyle.color" show-alpha />
      </div>
      <div class="background-color">
        <div class="thridLabel">背景颜色:</div>
        <el-color-picker @change="handleText('backgroundColor')" v-model="textStyle.backgroundColor" show-alpha />
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
          @change="handleText('border_set')"
        />
      </div>
      <div class="border-color">
        <div class="thridLabel">边框颜色:</div>
        <el-color-picker v-model="textStyle.border.color" @change="handleText('border_color')" show-alpha />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, inject, watch, defineEmits, reactive } from 'vue'
import { fontFamilyList, decorationStyle, defaultStyle } from '@/modules/person/presentation/text/text'
import { setUpdateData } from '@/modules/person/presentation/utils/utils'
export default {
  name: 'EditFont',
}
</script>
<script lang="ts" setup>
const textData = inject('textData')
const handleObj = inject('handleObj')
const fontFamilyData = ref(fontFamilyList)
const textStyle = reactive(defaultStyle())

const handleText = (type: string) => {
  let keyList = type.split('_')
  let updateData = setUpdateData(keyList, textStyle)
  handleObj.updateItem(textData.value.index, textData.value.type, updateData)
}

watch(
  () => textData.value.index,
  (newV, oldV) => {
    //NOTE: 判断是否是新的内容，如果是新的内容，那么就需要重新设置一下textStyle的值
    if (newV !== oldV) {
      Object.assign(textStyle, JSON.parse(JSON.stringify(textData.value.style)))
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  [
    () => textData.value.style.border,
    () => textData.value.style.color,
    () => textData.value.style.backgroundColor,
    () => textData.value.style.font,
    () => textData.value.style.text,
  ],
  (newV, oldV) => {
    Object.assign(textStyle.border, JSON.parse(JSON.stringify(newV[0])))
    textStyle.color = newV[1]
    textStyle.backgroundColor = newV[2]
    Object.assign(textStyle.font, JSON.parse(JSON.stringify(newV[3])))
    Object.assign(textStyle.text, JSON.parse(JSON.stringify(newV[4])))
  },
  {
    deep: true,
  }
)
</script>
<style lang="scss" scoped>
@import './font.scss';
</style>
