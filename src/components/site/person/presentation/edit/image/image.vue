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
          @change="handleImage('event_aspectRatio')"
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
          @change="handleImage('border_radius')"
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
      <div class="border-member">
        <div class="thridLabel" style="margin-right: 5px">显示:</div>
        <el-checkbox
          v-model="imageStyle.border.line"
          label="边框"
          :true-label="1"
          :false-label="0"
          border
          size="small"
          @change="handleImage('border_line')"
        />
      </div>
      <div class="border-member">
        <div class="thridLabel" style="margin-right: 5px">边框宽度:</div>
        <el-input
          class="input-number"
          size="small"
          v-model="imageStyle.border.width"
          :disabled="imageStyle.border.line == 'none'"
          @change="handleImage('border_width')"
        />
      </div>
      <div class="border-member">
        <div class="thridLabel">边框样式:</div>
        <el-select
          size="small"
          style="width: 60%"
          v-model="imageStyle.border.style"
          @change="handleImage('border_style')"
          placeholder="选取边框"
        >
          <el-option v-for="decoration in decorationStyle" :value="decoration.value" :label="decoration.label">
            <span :style="{ textDecorationLine: 'underline', textDecorationStyle: decoration.value }">{{
              decoration.label
            }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="border-member">
        <div class="thridLabel" style="margin-right: 5px">边框颜色:</div>
        <el-color-picker
          @change="handleImage('border_color')"
          :disabled="imageStyle.border.line == 'none'"
          v-model="imageStyle.border.color"
          show-alpha
        />
      </div>
    </div>
    <div class="filter-setting">
      <div class="subLabel">滤镜配置:</div>
      <el-select
        style="margin-top: 10px; width: 80%"
        multiple
        collapse-tags
        collapse-tags-tooltip
        v-model="imageStyle.style.setStyle"
        placeholder="滤镜配置"
        @change="handleImage('style_setStyle')"
      >
        <el-option
          v-for="(filter, index) in filterStyleList"
          :key="index"
          :label="filter.label"
          :value="filter.content"
        />
      </el-select>
      <div class="filter-member">
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('blur')">
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
            @change="handleImage('style_blur')"
          />
        </div>
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('brightness')">
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
            @change="handleImage('style_brightness')"
          />
        </div>
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('contrast')">
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
            @change="handleImage('style_contrast')"
          />
        </div>
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('opacity')">
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
            @change="handleImage('style_opacity')"
          />
        </div>
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('drop-shadow')">
          <span class="thridLabel">深度阴影:</span>
          <div class="shadow-set">
            <div class="shadow-member">
              <span class="forthLabel">x轴偏移:</span>
              <el-input
                @change="handleImage('style_drop-shadow_x')"
                class="input-number"
                size="small"
                v-model="imageStyle.style.drop_shadow.x"
              />
            </div>
            <div class="shadow-member">
              <span class="forthLabel">y轴偏移:</span>
              <el-input
                @change="handleImage('style_drop-shadow_y')"
                class="input-number"
                size="small"
                v-model="imageStyle.style.drop_shadow.y"
              />
            </div>
            <div class="shadow-member shadow-radius">
              <span class="forthLabel">阴影半径:</span>
              <el-input
                @change="handleImage('style_drop-shadow_radius')"
                class="input-number"
                size="small"
                v-model="imageStyle.style.drop_shadow.radius"
              />
            </div>
            <div class="shadow-member shadow-color">
              <span class="forthLabel">阴影颜色:</span>
              <el-color-picker
                @change="handleImage('style_drop-shadow_color')"
                class="shadow-color-picker"
                v-model="imageStyle.style.drop_shadow.color"
                show-alpha
              />
            </div>
          </div>
        </div>
        <div class="filter-member-item" v-show="imageStyle.style.setStyle.includes('invert')">
          <span class="thridLabel">颜色倒转:</span>
          <el-switch
            class="switch-invert"
            v-model="imageStyle.style.invert"
            size="small"
            active-text="翻转"
            inactive-text="原色"
            :active-value="1"
            :inactive-value="0"
            @change="handleImage('style_invert')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch, reactive, provide, inject } from 'vue'
import { setUpdateData } from '@/modules/person/presentation/utils/utils'
import { filterStyle, decorationStyle, imageInfo } from '@/modules/person/presentation/image/image'
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
const imageData = inject('imageData')
const handleObj = inject('handleObj')
const imageStyle = reactive(imageInfo())

const handleRotateChange = () => {
  imageStyle.attribute.angle =
    imageStyle.attribute.angle > 360 ? imageStyle.attribute.angle % 360 : imageStyle.attribute.angle
  handleImage('attribute_angle')
}
const rotateClick = () => {
  if (imageStyle.attribute.angle + 90 >= 360) {
    imageStyle.attribute.angle = (imageStyle.attribute.angle + 90) % 360
  } else {
    imageStyle.attribute.angle += 90
  }
  handleImage('attribute_angle')
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
  imageStyle.scale.x = sizeData.width / imageStyle.attribute.width
  imageStyle.scale.y = sizeData.height / imageStyle.attribute.height
  handleImage('scale')
}

watch(
  () => imageData.value.index,
  (newV, oldV) => {
    //NOTE: 判断是否是新的内容，如果是新的内容，那么就需要重新设置一下imageStyle的值
    if (newV !== oldV) {
      Object.assign(imageStyle, JSON.parse(JSON.stringify(imageData.value.style)))
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  [
    () => imageData.value.style.attribute.angle,
    () => imageData.value.style.scale,
    () => imageData.value.style.border,
    () => imageData.value.style.style,
    () => imageData.value.style.event.aspectRatio
  ],
  (newV, oldV) => {
    imageStyle.attribute.angle = newV[0]
    Object.assign(imageStyle.scale, JSON.parse(JSON.stringify(newV[1])))
    Object.assign(imageStyle.border, JSON.parse(JSON.stringify(newV[2])))
    Object.assign(imageStyle.style, JSON.parse(JSON.stringify(newV[3])))
    imageStyle.event.aspectRatio = newV[4]
  },
  {
    deep: true,
  }
)
watch(
  () => imageStyle.scale,
  (newV, oldV) => {
    const changedWidth = imageStyle.attribute.width * (1 - newV.x)
    sizeData.width = imageStyle.attribute.width - changedWidth
    const changedHeight = imageStyle.attribute.height * (1 - newV.y)
    sizeData.height = imageStyle.attribute.height - changedHeight
    sizeData.ratio = sizeData.width / sizeData.height
  },
  {
    immediate: true,
    deep: true,
  }
)

const handleImage = (type: string) => {
  let keyList = type.split('_')
  if (keyList.indexOf('drop-shadow') != -1) {
    keyList[1] = 'drop_shadow'
  }
  let updateData = setUpdateData(keyList, imageStyle)
  handleObj.updateItem(imageData.value.index, imageData.value.type, updateData)
}
</script>
<style lang="scss">
.el-select .el-select__tags > span {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
@import './image.scss';
</style>
