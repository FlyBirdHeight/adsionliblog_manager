<template>
  <div class="presentation-container">
    <div class="presentation-toolbar">
      <div class="toolbal_list" v-for="item of toolbar">
        <el-tooltip effect="light" :content="item.label" v-if="item.icon !== 'divide'" placement="top-start">
          <span @click="handleAction(item.handle)">
            <icon-font class="edit-icon" :icon="item.icon" />
          </span>
        </el-tooltip>
        <div v-else class="toolbar-divide"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import { PresentationToolbar } from '@/modules/type/site/person/person'
import { toolbarList } from '@/modules/person/presentation/toolbar'
import HandlePresentation from '@/modules/person/presentation/handle'
export default {
  name: 'PresentationContainer',
}
</script>
<script lang="ts" setup>
const toolbar = reactive<PresentationToolbar>(toolbarList)
const handleObj = reactive(new HandlePresentation());
console.log(handleObj);
const handleAction = (action: string) => {
  console.log(action);
  
}
</script>
<style lang="scss" scoped>
.presentation-container {
  .presentation-toolbar {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #f2f3f5;
    .toolbal_list span {
      padding: 5px 10px;
      margin: 0 3px;
      cursor: pointer;
    }
    .toolbal_list span:hover {
      border-radius: 5px;
      color: #fff;
      fill: #fff !important;
      background-color: #409eff;
    }
    .toolbal_list .toolbar-divide {
      border: 1px solid #f2f3f5;
      height: 20px;
      margin: auto;
    }
  }
}
</style>
