<template>
  <div class="image" :id="`imageView${this._uid}`">
    <div class="image-error" v-if="src.length == 0">
      <slot name="error-image"> 加载失败 </slot>
    </div>
    <img
      class="image-data"
      :src="src"
      @click="clickImage"
      :alt="alt"
      :style="imageStyle"
      :id="`imageData${this._uid}`"
      v-else
    />
    <template v-if="preview">
      <image-preview
        @closePreview="showViewer = false"
        :srcList="previewSrcList"
        :zIndex="zIndex"
        v-if="showViewer"
        :clickImageIndex="clickImageIndex"
      ></image-preview>
    </template>
  </div>
</template>

<script>
import ImagePreview from "./image-preview";
//判断浏览器是否支持object-fit属性，如果不支持需要自己处理object-fit的实现
const isSupportObjectFit = () =>
  document.documentElement.style.objectFit !== undefined;
const ObjectFit = {
  NONE: "none",
  CONTAIN: "contain",
  COVER: "cover",
  FILL: "fill",
  SCALE_DOWN: "scale-down",
};
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    fit: {
      type: String,
      default: "fill",
    },
    alt: {
      type: String,
      default: "image",
    },
    preview: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    previewSrcList: {
      type: Array,
      default: () => [],
    },
    imageStyleData: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.loadImage();
    this.handleSettingStyle();
  },
  data() {
    return {
      showViewer: false,
      imageWidth: 0,
      imageHeight: 0,
      error: false,
      loading: true,
      show: true,
      showImageStyle: {},
      clickImageIndex: 0
    };
  },
  methods: {
    /**
     * @method handleSettingStyle 处理外部传入的样式
     */
    handleSettingStyle() {
      let imageStyleData = this.imageStyleData;
      if (imageStyleData.length != 0) {
        if (imageStyleData.match(/:/g).length == 1) {
          imageStyleData = `${imageStyleData.replace(/;/g, "")}`.split(",");
        } else if (imageStyleData.match(/:/g).length > 1) {
          imageStyleData = `${imageStyleData.replace(/;/g, ",")}`.split(",");
        } else {
          imageStyleData = [];
        }
        if (imageStyleData.length != 0) {
          let imageStyleShowData = new Object();
          for (let value of imageStyleData) {
            let valueSplit = value.split(":");
            let key = valueSplit[0];
            let data = valueSplit[1];
            imageStyleShowData[key] = data;
          }
          this.showImageStyle = imageStyleShowData;
        }
      }
    },
    //图片加载过程
    loadImage() {
      if (this.$isServer) return;
      this.loading = true;
      this.error = false;
      let image = new Image();
      image.onerror = this.imageLoadError.bind(this);
      image.onload = (e) => this.handleLoad(e, image);
      if (Object.keys(this.$attrs).length != 0) {
        Object.keys(this.$attrs).map((v) => {
          const value = this.$attrs[v];
          image.setAttribute(v, value);
        });
      }
      image.src = this.src;
    },
    /**
     * @method handleLoad 处理Image加载完成后的操作
     */
    handleLoad(e, img) {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.loading = false;
      this.error = false;
    },
    /**
     * @method addImageStyle 添加图片样式，当object-fit属性不被平台支持的时候使用
     * @param {String} fit fit处理属性
     */
    addImageStyle(fit) {
      const { imageWidth, imageHeight } = this;
      const { clientWidth: containerWidth, clientHeight: containerHeight } =
        this.$el;
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) {
        return {};
      }
      if (fit === ObjectFit.SCALE_DOWN) {
        const changeType =
          imageWidth < containerWidth && imageHeight < containerHeight;
        fit = changeType ? ObjectFit.NONE : ObjectFit.CONTAIN;
      }
      const imageAspectRatio = imageWidth / imageHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      switch (fit) {
        case ObjectFit.NONE:
          return { height: "auto", width: "auto" };
        case ObjectFit.CONTAIN:
          return imageAspectRatio < containerAspectRatio
            ? { width: "auto" }
            : { height: "auto" };
        case ObjectFit.COVER:
          return imageAspectRatio < containerAspectRatio
            ? { height: "auto" }
            : { width: "auto" };
        default:
          return {};
      }
    },
    //图片加载失败时的回调
    imageLoadError(e) {
      this.error = true;
      this.$emit("error", e);
    },
    //图片被点击时事件
    clickImage() {
      if (!this.preview) {
        return;
      }
      document.body.style.overflow = "hidden";
      this.clickImageIndex = this.previewSrcList.indexOf(this.src);
      this.showViewer = true;
    },
  },
  computed: {
    imageStyle() {
      const { fit, preview } = this;
      if (!this.$isServer && fit) {
        return isSupportObjectFit()
          ? Object.assign(
              { "object-fit": fit, cursor: preview ? "pointer" : "normal" },
              this.showImageStyle
            )
          : Object.assign(this.addImageStyle(fit), this.showImageStyle);
      }
    },
  },
  watch: {
    src() {
      this.show && this.loadImage();
    },
    show(val) {
      val && this.loadImage();
    },
  },
  components: {
    ImagePreview,
  },
};
</script>

<style lang="scss" scoped>
@import "./image.scss";
</style>
