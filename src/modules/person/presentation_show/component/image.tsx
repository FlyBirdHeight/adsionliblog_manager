import { defineComponent, defineProps } from 'vue'
import { ImageItem } from '../../presentation/image/type'
import { analysisCss } from '../../presentation/image/image'
import getPositionStyle from '../../utils/style'

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

export default defineComponent({
  name: 'ShowImage',
  props: {
    info: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit, slots }) {
    let analysisData: any = analysisImage(props.info)
    console.log(analysisData.style.width)
    return () => <img draggable="false" src={analysisData.url} style={analysisData.style} class="preventationImage" />
  },
})
