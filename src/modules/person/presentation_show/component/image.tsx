import { defineComponent, watch, ref, withDirectives, vShow } from 'vue'
import { ImageItem } from '../../presentation/image/type'
import { analysisCss } from '../../presentation/image/image'
import getPositionStyle from '../../utils/style'
import ItemAnimation from '@/modules/person/presentation/animation/item_animation.vue'
const analysisImage = (data: any) => {
  if (!data) {
    return null
  }
  let style = analysisCss(data.style, data.url)
  style.position = 'absolute'
  Object.assign(style, getPositionStyle(data.style.scale, data.style.attribute, data.style.position))
  let url = data.url
  let index = data.index
  let type = data.type
  return {
    style,
    url,
    index,
    type,
  }
}

function getImage(analysisData: any) {
  if (!analysisData) return <img src={analysisData.url} class="preventationImage" />
  return <img draggable="false" src={analysisData.url} style={analysisData.style} class="preventationImage" />
}

export default defineComponent({
  name: 'ShowImage',
  props: {
    info: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit, slots }) {
    watch(
      () => props.info,
      (newV: any, oldV: any) => {
        if (newV) {
          analysisData.value = analysisImage(props.info)
        }
      },
      {
        deep: true,
      }
    )
    const analysisData: any = ref(analysisImage(props.info))
    return () => (
      <ItemAnimation animate={props.info.animate} duration={1000}>
        {withDirectives(getImage(analysisData.value), [
          [vShow, props.info.animate.show == null || props.info.animate.show],
        ])}
      </ItemAnimation>
    )
  },
})
