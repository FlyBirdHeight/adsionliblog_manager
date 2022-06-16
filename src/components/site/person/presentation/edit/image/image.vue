<template>
  <div class="edit-image">
    <div class="general-config">
      <div class="subLabel">通用配置:</div>
      <div class="rotate-set">
        <div class="thridLabel">旋转:</div>
      </div>
      <div class="flip-set">
        <div class="thridLabel">翻转:</div>
      </div>
      <div class="border-radius-set">
        <div class="thridLabel">半径设置:</div>
      </div>
    </div>
    <div class="resolution-setting">
      <div class="subLabel">大小设置:</div>
    </div>
    <div class="border-setting">
      <div class="subLabel">边框设置:</div>
    </div>
    <div class="filter-setting">
      <div class="subLabel">滤镜配置:</div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch, reactive, provide, inject } from 'vue'
import { filterStyle } from '@/modules/person/presentation/image/image'
export default {
  name: 'EditImage',
}
</script>
<script lang="ts" setup>
const filterStyleList = ref(filterStyle)
</script>
<style lang="scss" scoped>
.edit-image {
  margin-bottom: 10px;
  .general-config,
  .resolution-setting,
  .border-setting,
  .filter-setting {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;
    .subLabel {
      @include subHeader();
      width: 100%;
    }
  }
  .rotate-set,
  .flip-set,
  .border-radius-set {
    margin-top: 5px;
    height: 35px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .thridLabel {
      @include thridHeader();
    }
  }
}
</style>
