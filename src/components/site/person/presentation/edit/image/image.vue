<template>
  <div class="edit-image">
    <div class="general-config">
      <div class="subLabel">通用配置:</div>
      <div class="rotate-set">
        <div class="thridLabel">旋转:</div>
        <el-input-number
          v-model="imageStyle.attribute.angle"
          class="angle-setting"
          size="small"
          :precision="2"
          controls-position="right"
          @change="handleRotateChange"
        />
        <div class="angle-rotate-button">
          <el-button style="width: 70%" size="small" @click.stop="rotateClick">旋转90度</el-button>
        </div>
      </div>
      <div class="flip-set">
        <div class="thridLabel">等比放缩:</div>
        <el-switch
          class="switch-ratio"
          v-model="imageStyle.event.aspectRatio"
          size="small"
          active-text="开启"
          inactive-text="关闭"
        />
      </div>
      <div class="border-radius-set">
        <div class="thridLabel">显示半径设置:</div>
        <el-input-number
          v-model="imageStyle.border.radius"
          class="radius-setting"
          size="small"
          :precision="0"
          :min="0"
          :max="100"
          label="%"
          controls-position="right"
        />
      </div>
    </div>
    <div class="resolution-setting">
      <div class="subLabel">大小设置:</div>
      <div class="size-setting">
        <div class="size-width">
          <div class="thridLabel">宽度:</div>
          <el-input-number
            class="size-input"
            v-model="sizeData.width"
            :precision="0"
            :min="1"
            size="small"
            controls-position="right"
            @change="handleSizeChange('width')"
          />
        </div>
        <div class="size-height">
          <div class="thridLabel">高度:</div>
          <el-input-number
            class="size-input"
            v-model="sizeData.height"
            :precision="0"
            :min="1"
            size="small"
            controls-position="right"
            @change="handleSizeChange('height')"
          />
        </div>
        <div class="size-ratio-set">
          <div class="thridLabel">等比限制:</div>
          <el-switch class="switch-ratio" v-model="ratioLimit" size="small" active-text="限制" inactive-text="不限制" />
        </div>
      </div>
    </div>
    <div class="border-setting">
      <div class="subLabel">边框设置:</div>
    </div>
    <div class="filter-setting">
      <div class="subLabel">滤镜配置:</div>
      <el-select
        style="margin-top: 10px; width: 80%"
        multiple
        collapse-tags
        collapse-tags-tooltip
        v-model="imageFilter"
        placeholder="滤镜配置"
      >
        <el-option
          v-for="(filter, index) in filterStyleList"
          :key="index"
          :label="filter.label"
          :value="filter.content"
        />
      </el-select>
      <div class="filter-member">
        <div class="filter-member-item" v-show="imageFilter.includes('blur')">
          <span class="thridLabel">模糊:</span>
          <el-input-number
            class="number-input"
            v-model="imageStyle.style.blur"
            :precision="1"
            :step="0.5"
            :min="0"
            :max="100"
            size="small"
            controls-position="right"
          />
        </div>
        <div class="filter-member-item" v-show="imageFilter.includes('brightness')">
          <span class="thridLabel">亮度:</span>
          <el-input-number
            class="number-input"
            v-model="imageStyle.style.brightness"
            :precision="1"
            :step="0.5"
            :min="0"
            :max="6"
            size="small"
            controls-position="right"
          />
        </div>
        <div class="filter-member-item" v-show="imageFilter.includes('contrast')">
          <span class="thridLabel">对比度:</span>
          <el-input-number
            class="number-input"
            v-model="imageStyle.style.contrast"
            :precision="1"
            :step="0.5"
            :min="0"
            :max="20"
            size="small"
            controls-position="right"
          />
        </div>
        <div class="filter-member-item" v-show="imageFilter.includes('opacity')">
          <span class="thridLabel">透明度:</span>
          <el-input-number
            class="number-input"
            v-model="imageStyle.style.opacity"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="1"
            size="small"
            controls-position="right"
          />
        </div>
        <div class="filter-member-item" v-show="imageFilter.includes('drop_shadow')">
          <span class="thridLabel">深度阴影:</span>
          <div class="shadow-set">
            <div class="shadow-member">
              <span class="forthLabel">x轴偏移:</span>
              <el-input class="input-number" size="small" v-model="imageStyle.style.drop_shadow.x" />
            </div>
            <div class="shadow-member">
              <span class="forthLabel">y轴偏移:</span>
              <el-input class="input-number" size="small" v-model="imageStyle.style.drop_shadow.y" />
            </div>
            <div class="shadow-member shadow-radius">
              <span class="forthLabel">阴影半径:</span>
              <el-input class="input-number" size="small" v-model="imageStyle.style.drop_shadow.radius" />
            </div>
            <div class="shadow-member shadow-color">
              <span class="forthLabel">阴影颜色:</span>
              <el-color-picker class="shadow-color-picker" v-model="imageStyle.style.drop_shadow.color" show-alpha />
            </div>
          </div>
        </div>
        <div class="filter-member-item" v-show="imageFilter.includes('invert')">
          <span class="thridLabel">颜色倒转:</span>
          <el-switch
            class="switch-invert"
            v-model="imageStyle.style.invert"
            size="small"
            active-text="翻转"
            inactive-text="原色"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
      </div>
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
const ratioLimit = ref<boolean>(true)
const sizeData = reactive({
  height: 0,
  width: 0,
  ratio: 1,
})
const imageFilter = ref(['drop_shadow'])
const imageStyle = inject('imageStyle')

const handleRotateChange = () => {
  imageStyle.value.attribute.angle =
    imageStyle.value.attribute.angle > 360 ? imageStyle.value.attribute.angle % 360 : imageStyle.value.attribute.angle
}
const rotateClick = () => {
  if (imageStyle.value.attribute.angle + 90 >= 360) {
    imageStyle.value.attribute.angle = (imageStyle.value.attribute.angle + 90) % 360
  } else {
    imageStyle.value.attribute.angle += 90
  }
}
const handleSizeChange = (type: string) => {
  if (type === 'width') {
    if (ratioLimit.value) {
      sizeData.height = sizeData.width / sizeData.ratio
    } else {
      sizeData.ratio = sizeData.width / sizeData.height
    }
  } else {
    if (ratioLimit.value) {
      sizeData.width = sizeData.height * sizeData.ratio
    } else {
      sizeData.ratio = sizeData.width / sizeData.height
    }
  }
  imageStyle.value.scale.x = sizeData.width / imageStyle.value.attribute.width
  imageStyle.value.scale.y = sizeData.height / imageStyle.value.attribute.height
}
watch(
  () => imageStyle.value.scale,
  (newV, oldV) => {
    const changedWidth = imageStyle.value.attribute.width * (1 - newV.x)
    sizeData.width = imageStyle.value.attribute.width - changedWidth
    const changedHeight = imageStyle.value.attribute.height * (1 - newV.y)
    sizeData.height = imageStyle.value.attribute.height - changedHeight
    sizeData.ratio = sizeData.width / sizeData.height
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
<style lang="scss">
.el-select .el-select__tags > span {
  padding-left: 10px;
}
</style>
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
    height: auto;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .thridLabel {
      @include thridHeader();
      width: 30%;
      text-align: right;
    }
  }
  .rotate-set {
    .angle-setting {
      width: 50%;
      margin-left: 10px;
      flex-shrink: 0;
    }
    .angle-rotate-button {
      margin: 10px 0;
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .flip-set {
    height: 40px;
    .switch-ratio {
      width: 50%;
      margin-left: 20px;
    }
  }
  .border-radius-set {
    .radius-setting {
      width: 50%;
      margin-left: 10px;
      flex-shrink: 0;
    }
  }
  .size-setting {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    .size-width,
    .size-height,
    .size-ratio-set {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      .thridLabel {
        @include thridHeader();
        width: 30%;
        text-align: right;
      }
      .size-input,
      .switch-ratio {
        margin-left: 20px;
        width: 50%;
      }
    }
  }
  .filter-member {
    width: 100%;
    margin-top: 10px;
    .filter-member-item {
      margin-top: 5px;
      min-height: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .thridLabel {
        @include thridHeader();
        width: 20%;
        text-align: right;
      }
      .number-input {
        width: 50%;
        margin-left: 10px;
      }
      .switch-invert {
        width: 60%;
        margin-left: 10px;
      }
      .shadow-set {
        min-height: 50px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align: center;
        flex-wrap: wrap;
        .shadow-member {
          width: 45%;
          height: 40px;
          line-height: 40px;
          display: inline;
          .forthLabel {
            display: inline-block;
            @include thridHeader();
            width: 40%;
            text-align: right;
            margin-right: 5px;
          }
          .input-number {
            display: inline-block;
            width: 45%;
          }
        }
        .shadow-radius {
          width: 45%;
          .forthLabel {
            text-align: left;
            margin-right: 0px;
            width: 50%;
          }
          .input-number {
            width: 40%;
          }
        }
        .shadow-color {
          width: 50%;
          .forthLabel {
            text-align: left;
            margin-right: 0px;
            width: 40%;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
