import { defineComponent, watch, ref } from 'vue'
import { analysisCss } from '@/modules/person/presentation/text/text'
import getPositionStyle from '../../utils/style'

const analysisText = (data: any) => {
  if (!data) {
    return null
  }
  let style = analysisCss(data.style)
  style.position = 'absolute'
  Object.assign(style, getPositionStyle(data.style.scale, data.style.attribute, data.style.position))
  let index = data.index
  let type = data.type
  return {
    style,
    index,
    type,
    data: data.data,
  }
}

const renderText = (analysisData: any) => {
  if (!analysisData) return

  return <div style={analysisData.style} v-html={analysisData.data} />
}

export default defineComponent({
  name: 'ShowText',
  props: {
    info: {
      type: Object,
      default: null,
    },
  },
  setup(props: any, context: any) {
    watch(
      () => props.info,
      (newV: any, oldV: any) => {
        if (newV) {
          analysisData.value = analysisText(props.info)
        }
      }
    )
    const analysisData: any = ref(analysisText(props.info))
    return () => renderText(analysisData)
  },
})
