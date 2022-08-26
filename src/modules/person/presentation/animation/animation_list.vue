<template>
  <div class="animate-container">
    <div class="page-animate">
      <div class="label" style="cursor: pointer" @click.stop="hideStatus.pageChoice = !hideStatus.pageChoice">
        <span>页面切换:</span>
        <span style="float: right">
          <open-icon :change="hideStatus.pageChoice" />
        </span>
      </div>
      <transition-group name="open-show">
        <div class="page-choice" key="pageChoice" v-if="hideStatus.pageChoice">
          <div class="animate-in">
            <div class="choice-label">进入动画:</div>
            <div class="choice">
              <el-popover placement="bottom" :width="300" trigger="hover">
                <template #reference>
                  <div class="none-choice" v-if="checkAnimate.page.in == null">
                    <el-icon><component :is="$icon['Plus']" /></el-icon>
                  </div>
                  <div class="own-animate" v-else>
                    <div class="data-icon">
                      <span>
                        <icon-font class="edit-icon" :icon="checkAnimate.page.in.info.icon" />
                      </span>
                    </div>
                    <div class="data-label">{{ checkAnimate.page.in.info.label }}</div>
                  </div>
                </template>
                <div class="page-animate_choice" v-if="hideStatus.pageChoice">
                  <div class="choice-data" v-for="(item, index) of choiceList.pageList">
                    <div class="data-icon">
                      <span @click.stop="handleAction(item.action, 'in')">
                        <icon-font class="edit-icon" :icon="item.icon" />
                      </span>
                    </div>
                    <div class="data-label">{{ item.label }}</div>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
          <div class="animate-out">
            <div class="choice-label">离开动画:</div>
            <div class="choice">
              <el-popover placement="bottom" :width="300" trigger="hover">
                <template #reference>
                  <div class="none-choice" v-if="checkAnimate.page.out == null">
                    <el-icon><component :is="$icon['Plus']" /></el-icon>
                  </div>
                  <div class="own-animate" v-else>
                    <div class="data-icon">
                      <span>
                        <icon-font class="edit-icon" :icon="checkAnimate.page.out.info.icon" />
                      </span>
                    </div>
                    <div class="data-label">{{ checkAnimate.page.out.info.label }}</div>
                  </div>
                </template>
                <div class="page-animate_choice" v-if="hideStatus.pageChoice">
                  <div class="choice-data" v-for="(item, index) of choiceList.pageList">
                    <div class="data-icon">
                      <span @click.stop="handleAction(item.action, 'out')">
                        <icon-font class="edit-icon" :icon="item.icon" />
                      </span>
                    </div>
                    <div class="data-label">{{ item.label }}</div>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <div
          class="page-animate-setting"
          key="pageSetting"
          v-if="checkAnimate.page.in != null || checkAnimate.page.out != null"
        >
          <div class="setting-in" v-if="checkAnimate.page.in != null">
            <span>进入动画持续时间：</span>
          </div>
          <div class="setting-out" v-if="checkAnimate.page.out != null">
            <span>离开动画持续时间：</span>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="item-animate">
      <div class="item-animate_label"></div>
      <div class="item-animate_choice"></div>
      <div class="item-animate_list"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
import { pageAnimate } from './data/list'
export default {
  name: 'AnimationList',
}
</script>
<script lang="ts" setup>
const props = defineProps()
const emit = defineEmits([])
const hideStatus = reactive({
  pageChoice: true,
  itemChoice: false,
  itemAnimateList: false,
})
const choiceList = reactive({
  pageList: pageAnimate,
})
const checkAnimate = reactive({
  page: {
    in: null,
    out: null,
  },
})
const handleAction = (action: string, type: string) => {
  if (type === 'in') {
    checkAnimate.page.in = {
      action,
      time: 1000,
      mode: 'in',
      info: getActionInfo(action),
    }
  } else {
    checkAnimate.page.out = {
      action,
      time: 1000,
      mode: 'out',
      info: getActionInfo(action),
    }
  }
}
const getActionInfo = (action: string) => {
  for (let value of pageAnimate) {
    if (value.action === action) {
      return {
        label: value.label,
        icon: value.icon,
      }
    }
  }

  return null
}
const showPop = (type: string) => {
  if (type === 'in') {
    hideStatus.pageAnimate.in = !hideStatus.pageAnimate.in
  } else if (type === 'out') {
    hideStatus.pageAnimate.out = !hideStatus.pageAnimate.out
  }
}
</script>
<style lang="scss" scoped>
@import './scss/animate_list.scss';
</style>
