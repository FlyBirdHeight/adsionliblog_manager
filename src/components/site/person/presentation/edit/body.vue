<template>
  <div class="presentation-body-setting">
    <div class="setting">
      <div class="bg-setting">
        <div class="label">背景设置：</div>
        <div class="bg-select">
          <el-popover v-model:visible="checkedImage" placement="top" :width="160">
            <p style="font-size: 13px; font-weight: 500">选择添加背景图方式：</p>
            <div style="display: flex; justify-content: flex-start; align-items: center">
              <el-button size="small" type="primary" @click="setImageData('linkPath')">外链添加</el-button>
              <el-button size="small" type="success" @click="setImageData('uploadImage')">图片上传</el-button>
            </div>
            <template #reference>
              <el-button size="small" @click="checkedImage = true">选择图片</el-button>
            </template>
          </el-popover>
          <el-color-picker v-model="bgColor" show-alpha @change="changeBgColor" />
        </div>
      </div>
      <div class="bg-image-setting" v-show="bgImage !== ''">
        <div class="label" style="cursor: pointer" @click.stop="hideStatus.bgSetting = !hideStatus.bgSetting">
          <span>背景图设置：</span>
          <span style="float: right">
            <open-icon :change="hideStatus.bgSetting" />
          </span>
        </div>
        <transition name="bg-image-setting-show">
          <div class="bg-image-setting-item" v-if="hideStatus.bgSetting">
            <div class="bg-image-preview" style="margin-bottom: 5px">
              <div class="sub-label">预览：</div>
              <el-image
                style="width: 146px; height: 146px; margin: auto; display: block"
                :src="bgImage"
                :fit="'cover'"
              />
            </div>
            <div class="bg-image-size">
              <span class="sub-label">大小：</span>
              <div class="bg-image-size-group">
                <div class="bg-image-x-size">
                  <span class="third-title">x方向大小(%):</span>
                  <el-input-number
                    style="width: 100px"
                    controls-position="right"
                    label="%"
                    v-model="formData.xSize"
                    :min="1"
                    :max="200"
                    size="small"
                  />
                </div>
                <div class="bg-image-y-size">
                  <span class="third-title">y方向大小(%):</span>
                  <el-input-number
                    style="width: 100px"
                    controls-position="right"
                    v-model="formData.ySize"
                    :min="1"
                    :max="200"
                    size="small"
                  />
                </div>
              </div>
            </div>
            <div class="bg-image-repeat">
              <span class="sub-label">重复：</span>
              <el-radio-group class="bg-image-repeat-group" v-model="formData.bgRepeat">
                <el-radio label="no-repeat" size="small">不重复</el-radio>
                <el-radio label="repeat" size="small">普通</el-radio>
                <el-radio label="repeat-x" size="small">x轴重复</el-radio>
                <el-radio label="repeat-y" size="small">y轴重复</el-radio>
              </el-radio-group>
            </div>
            <div class="bg-image-position">
              <span class="sub-label">显示位置：</span>
              <div class="bg-image-position-group">
                <div class="bg-image-x-position">
                  <span class="third-title">x方向偏移(%):</span>
                  <el-input-number
                    style="width: 100px"
                    controls-position="right"
                    v-model="formData.xPosition"
                    :min="-99"
                    :max="200"
                    size="small"
                  />
                </div>
                <div class="bg-image-y-position">
                  <span class="third-title">y方向偏移(%):</span>
                  <el-input-number
                    style="width: 100px"
                    controls-position="right"
                    v-model="formData.yPosition"
                    :min="-99"
                    :max="200"
                    size="small"
                  />
                </div>
              </div>
            </div>
            <div class="bg-image-button">
              <el-button size="small" type="primary">自定义设置</el-button>
              <el-button size="small" type="danger" @click="removeBgImage">移除背景图</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="item-list">
      <div class="label">页面内容：</div>
      <body-item-list></body-item-list>
    </div>
  </div>
  <edit-body-image-setting
    :show="showImageSetting"
    @closeDialog="closeDialog"
    @setImagePath="setImagePath"
    :type="settingType"
  ></edit-body-image-setting>
</template>
<script lang="ts">
import { ref, reactive, defineEmits, watch } from 'vue'
export default {
  name: 'PresentationBodySetting',
}
</script>
<script lang="ts" setup>
import EditBodyImageSetting from '@/components/dialog/presentation/edit/image_setting.vue'
import BodyItemList from '@/components/site/person/presentation/edit/body_item_list.vue'

const emit = defineEmits(['setBackground', 'editBackground', 'removeBackgroundImage'])

const bgColor = ref('rgba(255,255,255, 1.0)')
const bgImage = ref<string>('')
const checkedImage = ref<boolean>(false)
const showImageSetting = ref<boolean>(false)
const hideStatus = reactive({
  bgSetting: true,
})
const settingType = ref<string>('linkPath')
const formData = reactive({
  bgRepeat: 'repeat',
  xSize: 100,
  ySize: 100,
  xPosition: 0,
  yPosition: 0,
})

const setImagePath = (val: string) => {
  bgImage.value = val
  emit('setBackground', bgImage.value, formData)
}
const changeBgColor = (val: string) => {
  if (bgImage.value !== '') {
    return
  }
  emit('setBackground', bgColor.value, null)
}
const closeDialog = (val: boolean) => {
  showImageSetting.value = false
}
//NOTE: 背景图片设置相关
const setImageData = (type: string) => {
  checkedImage.value = false
  settingType.value = type
  showImageSetting.value = true
}
const removeBgImage = () => {
  bgImage.value = ''
  emit('removeBackgroundImage', bgColor.value)
}
watch(
  formData,
  (newV, oldV) => {
    emit('editBackground', newV)
  },
  {
    deep: true,
  }
)
</script>
<style lang="scss" scoped>
@mixin settingLabel() {
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  height: 35px;
}
@mixin subSettingLabel() {
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  height: 25px;
  line-height: 25px;
}
@mixin thirdTitle() {
  font-size: 12px;
  font-weight: 500;
}
@mixin normalFlex() {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.presentation-body-setting {
  margin-top: 10px;
  .setting {
    padding: 4px;
    .bg-setting {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #dcdfe6;
      .label {
        @include settingLabel();
      }
      .bg-select {
        width: 100%;
        @include normalFlex();
      }
    }
    .bg-image-setting {
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dcdfe6;
      .label {
        @include settingLabel();
      }
      .bg-image-setting-item {
        .bg-image-size,
        .bg-image-repeat,
        .bg-image-position {
          @include normalFlex();
        }
        .bg-image-button {
          @include normalFlex();
          justify-content: flex-end;
          margin-top: 10px;
          padding: 0 10px;
        }
        .sub-label {
          @include subSettingLabel();
        }
        .bg-image-size {
          .bg-image-size-group {
            width: 100%;
            .bg-image-x-size {
              @include normalFlex();
              margin-bottom: 5px;
            }
            .bg-image-y-size {
              @include normalFlex();
            }
          }
        }
        .bg-image-position {
          .bg-image-position-group {
            width: 100%;
            .bg-image-x-position {
              @include normalFlex();
              margin-bottom: 5px;
            }
            .bg-image-y-position {
              @include normalFlex();
            }
          }
        }
        .bg-image-repeat .bg-image-repeat-group {
          width: 70%;
          margin: auto;
        }
        .third-title {
          @include thirdTitle();
        }
      }
    }
  }
  .item-list {
    padding: 4px;
    .label {
      @include settingLabel();
    }
  }
}

.bg-image-setting-show-enter-from {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.bg-image-setting-show-enter-to {
  opacity: 1;
  max-height: 600px;
}
.bg-image-setting-show-enter-active {
  transition: all 0.4s linear;
  overflow: hidden;
}
.bg-image-setting-show-leave-active {
  transition: all 0.4s linear;
  max-height: 600px;
}
.bg-image-setting-show-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.bg-image-setting-show-leave {
  max-height: 600px;
  opacity: 1;
}
</style>
