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
    <div class="presentation_body">
      <template v-if="itemMap.text.length != 0">
        <presentation-text v-for="(text, index) of itemMap.text" :textInfo="text"></presentation-text>
      </template>
      <template v-if="itemMap.image.length != 0">
        <presentation-image v-for="(text, index) of itemMap.image"></presentation-image>
      </template>
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
import PresentationText from '@/modules/person/presentation/text/text.vue'
import PresentationImage from '@/modules/person/presentation/image/image.vue'
const toolbar = reactive<PresentationToolbar>(toolbarList)
const handleObj = reactive(new HandlePresentation())
const itemMap = reactive({
  text: [],
  image: [],
  code: [],
})
const handleAction = (action: string) => {
  let fn = Reflect.get(handleObj, action)
  if (action === 'addTextArea') {
    itemMap.text.push(fn())
  }
}
</script>
<style lang="scss" scoped>
.presentation-container {
  height: 100%;
  width: 100%;
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
  .presentation_body {
    width: 100%;
    overflow: hidden;
    height: calc(100% - 41px);
    position: relative;
  }
}
</style>
