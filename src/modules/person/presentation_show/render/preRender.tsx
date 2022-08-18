import { defineComponent, inject, ref, watch, nextTick } from 'vue'
import styles from './preRender.module.scss'
import ShowText from '@/modules/person/presentation_show/component/text.tsx'
import ShowImage from '@/modules/person/presentation_show/component/image.tsx'
import { ImageItem } from '../../presentation/image/type'
import { TextItem } from '../../presentation/text/type'
import { PageBack } from '../../presentation/type'
import { analysisBackground, getAnalysisBackgroundStyle } from '@/modules/person/presentation/utils/item'
import { generatePageImage } from '../../presentation/utils/utils'

function renderText(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = ShowText
  return data.map((text: TextItem) => {
    return <tag info={text} />
  })
}
function renderImage(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = ShowImage
  return data.map((image: ImageItem) => {
    return <tag info={image} />
  })
}
/**
 * @method renderBackground 渲染背景设置
 * @param {PageBack} backgroundData 背景设置内容
 * @param {any} preRenderContainer 渲染背景Dom
 */
function renderBackground(backgroundData: PageBack, preRenderContainer: any, getStyle: boolean = false) {
  let { background } = backgroundData
  if (getStyle) {
    return getAnalysisBackgroundStyle(background)
  }
  analysisBackground(background, preRenderContainer)
}
/**
 * @method firstRenderPage 首次渲染页面
 * @param {Map} pageList
 */
function firstRenderPage(pageList: Map<number, any>, refList: any) {
  let arr: any[] = []
  for (let [key, page] of pageList) {
    arr.push(page)
  }
  return arr.map((v: any) => {
    return (
      <div
        class={styles.preRender}
        tabindex="-1"
        ref={(el: any) => {
          if (!refList.value.includes(el)) {
            refList.value.push(el)
          }
        }}
        style={renderBackground(v.setting, null, true)}
      >
        {renderText(v.item.text)}
        {renderImage(v.item.image)}
      </div>
    )
  })
}

export default defineComponent({
  name: 'PreRenderContainer',
  props: {
    display: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, cxt) {
    const handleObj: any = inject('handleObj')
    const pageMap: any = ref(handleObj.currentPageData)
    const preRenderContainer: any = ref()
    const preRenderList = ref([])
    const display: boolean = props.display

    const pageImage = ref([])
    const pageCount = ref(handleObj.pageList.size)

    const pageList = ref(null)

    const firstRender = ref(true)

    const emit = cxt.emit
    watch(
      () => handleObj.currentPageData,
      async (newV: any, oldV: any) => {
        pageMap.value = newV
        renderBackground(pageMap.value.setting, preRenderContainer.value, false)
        if (firstRender.value) {
          pageCount.value = handleObj.pageList.size
          pageList.value = handleObj.pageList
          nextTick(async () => {
            let promiseList = preRenderList.value.map((v: any, i: number) => {
              return generatePageImage(v, i + 1, pageImage.value)
            })
            await Promise.all(promiseList)
            emit('getPage', pageImage.value)
            firstRender.value = false
          })
        }
      }
    )
    return () => (
      <div>
        <div v-show={display} class={styles.preRender} tabindex="-1" ref={preRenderContainer}>
          {renderText(pageMap.value.item.text)}
          {renderImage(pageMap.value.item.image)}
        </div>
        {firstRender.value === true ? firstRenderPage(handleObj.pageList, preRenderList) : false}
      </div>
    )
  },
})
