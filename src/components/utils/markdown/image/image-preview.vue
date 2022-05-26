<template>
  <div class="image-preview" :style="{ zIndex: zIndex }">
    <div class="image-preview-board" @click="closePreview"></div>
    <span
      style="z-index: 1"
      @click="closePreview"
      class="image-preview-btn image-preview-close"
      ><i class="iconfont icon-close"></i
    ></span>
    <span
      style="z-index: 1"
      @click="next"
      class="image-preview-btn image-preview-next"
      ><i class="el-icon-right"></i
    ></span>
    <span
      style="z-index: 1"
      @click="pre"
      class="image-preview-btn image-preview-pre"
      ><i class="el-icon-back"></i
    ></span>
    <div class="image-preview-btn image-preview-btn-group" style="z-index: 1">
      <div class="image-preview-bottom-btn">
        <i style="cursor: pointer" class="el-icon-zoom-in" @click="zoomIn"></i>
        <i
          style="cursor: pointer"
          class="el-icon-zoom-out"
          @click="zoomOut"
        ></i>
        <i
          style="cursor: pointer"
          :class="
            aspectSetting
              ? 'el-icon-c-scale-to-original'
              : 'el-icon-full-screen'
          "
          @click="setAspect"
        ></i>
        <i
          style="cursor: pointer"
          class="el-icon-refresh-left"
          @click="rotateLeft"
        ></i>
        <i
          style="cursor: pointer"
          class="el-icon-refresh-right"
          @click="rotateRight"
        ></i>
      </div>
    </div>
    <div class="image-preview-main-body">
      <img
        @load="imageLoad"
        @error="imageLoadError"
        @mousedown="dragImagePosition"
        :style="imageStyle"
        :src="currentImage"
        alt="imageList"
      />
    </div>
  </div>
</template>

<script>
import { on, off, rafThrottle } from "@/funcs/utils/dom.js";
//获取鼠标滚轮事件
const mouseWheel = () =>
  "onwheel" in document.createElement("div")
    ? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
    : document.onmousewheel !== undefined
    ? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
    : "DOMMouseScroll"; // 低版本firefox

export default {
  name: "ImagePreview",
  props: {
    srcList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    clickImageIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: true,
      lastShowIndex: 0,
      aspectSetting: false,
      currentImage: "",
      rotateStep: 90,
      scaleStep: 0.2,
      keyDownEvent: null,
      mouseWheelHandler: null,
      transform: {
        rotate: 0,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
    };
  },
  mounted() {
    // this.getImage();
    this.currentImage = this.srcList[this.clickImageIndex];
    this.lastShowIndex = this.clickImageIndex
    this.supportInput();
  },
  computed: {
    imageStyle() {
      const { scale, rotate, offsetX, offsetY, enableTransition } =
        this.transform;
      return {
        "max-width": "100%",
        "max-height": "100%",
        marginLeft: `${offsetX}px`,
        marginTop: `${offsetY}px`,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transition: enableTransition ? "transform 0.3s ease 0s" : "",
      };
    },
  },
  methods: {
    /**
     * @method dragImagePosition 鼠标按下事件，由于处理图片的拖动
     */
    dragImagePosition(e) {
      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      let dragHandler = rafThrottle((event) => {
        this.transform.offsetX = offsetX + event.pageX - startX;
        this.transform.offsetY = offsetY + event.pageY - startY;
      });
      on(this.$isServer)(document, "mousemove", dragHandler);
      on(this.$isServer)(document, "mouseup", (ev) => {
        off(this.$isServer)(document, "mousemove", dragHandler);
      });
      e.preventDefault();
    },
    /**
     * @method supportInput 支持的操作
     */
    supportInput() {
      this.keyDownEvent = (e) => {
        e.stopPropagation();
        switch (e.keyCode) {
          //方向键左键
          case 37:
            this.pre();
            break;
          //方向键上键
          case 38:
            this.zoomIn();
            break;
          //方向键右键
          case 39:
            this.next();
            break;
          //方向键下键
          case 40:
            this.zoomOut();
            break;
          case 27:
            this.closePreview();
            break;
          default:
            break;
        }
      };
      this.mouseWheelHandler = rafThrottle((e) => {
        /**
         * NOTE: wheelDelta和detail都是用来判断滚轮是上滑还是下滑，但是在不同浏览器的平台中的判断条件不同，所以需要两个都叫判断
         * NOTE: 当使用window.requestAnimationFrame的时候，是可以不使用transition的
         */
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.transform.enableTransition = false;
          this.zoomIn(false);
        } else {
          this.transform.enableTransition = false;
          this.zoomOut(false);
        }
      });
      on(this.$isServer)(document, "keydown", this.keyDownEvent);
      on(this.$isServer)(document, mouseWheel(), this.mouseWheelHandler);
    },
    /**
     * @method imageLoad 图片加载完成的回调
     */
    imageLoad(e) {
      this.loading = false;
      this.resetTransfrom();
    },
    /**
     * @method imageLoadError 图片加载失败的回调
     */
    imageLoadError(e) {
      this.loading = false;
      this.resetTransfrom();
      e.target.alt = "加载失败";
    },
    /**
     * @method closePreview 关闭预览页面
     */
    closePreview() {
      off(this.$isServer)(document, "keydown", this.keyDownEvent);
      off(this.$isServer)(document, mouseWheel(), this.mouseWheelHandler);
      document.body.style.overflow = "";
      this.$emit("closePreview");
    },
    /**
     * @method next 前往下一张图片
     */
    next() {
      if (this.lastShowIndex == this.srcList.length - 1) {
        this.lastShowIndex = 0;
        this.getImage();
      } else {
        this.lastShowIndex++;
        this.getImage();
      }
    },
    /**
     * @method next 前往上一张图片
     */
    pre() {
      if (this.lastShowIndex == 0) {
        this.lastShowIndex = this.srcList.length - 1;
        this.getImage();
      } else {
        this.lastShowIndex--;
        this.getImage();
      }
    },
    /**
     * @method zoomOut 图片缩小
     */
    zoomOut(type = true) {
      if (this.transform.scale < 0.3) {
        return;
      }
      if (type) {
        this.transform.enableTransition = true;
      } else {
        this.scaleStep = 0.015;
      }
      this.transform.scale = parseFloat(
        (this.transform.scale - this.scaleStep).toFixed(3)
      );
    },
    /**
     * @method zoomIn 图片放大
     */
    zoomIn(type = true) {
      if (type) {
        this.transform.enableTransition = true;
      } else {
        this.scaleStep = 0.015;
      }
      this.transform.scale = parseFloat(
        (this.transform.scale + this.scaleStep).toFixed(3)
      );
    },
    /**
     * @method setAspect 修改图片分辨率：一种是宽高1:1，一种是实际大小
     */
    setAspect() {
      this.aspectSetting = !this.aspectSetting;
    },
    /**
     * @method setAspect 图片左旋
     */
    rotateLeft() {
      this.transform.rotate -= this.rotateStep;
      this.transform.enableTransition = true;
    },
    /**
     * @method setAspect 图片右旋
     */
    rotateRight() {
      this.transform.rotate += this.rotateStep;
      this.transform.enableTransition = true;
    },
    getImage() {
      if (this.srcList.length == 0) {
        return;
      }
      this.currentImage = this.srcList[this.lastShowIndex];
    },
    /**
     * @method resetTransfrom 重置transfrom数据
     */
    resetTransfrom() {
      this.transform = {
        rotate: 0,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./image.scss";
</style>
