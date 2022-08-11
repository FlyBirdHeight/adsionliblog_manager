import { defineComponent, inject, ref, watch } from 'vue'
import styles from './preRender.module.scss'
import ShowText from '@/modules/person/presentation_show/component/text.tsx'
import ShowImage from '@/modules/person/presentation_show/component/image.tsx'
import { ImageItem } from '../../presentation/image/type'
import { TextItem } from '../../presentation/text/type'
import { PageBack } from '../../presentation/type'
import { analysisBackground } from '@/modules/person/presentation/utils/item'

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
function renderBackground(backgroundData: PageBack, preRenderContainer: any) {
  let { background } = backgroundData
  analysisBackground(background, preRenderContainer)
}

export default defineComponent({
  name: 'PreRenderContainer',
  setup(props, cxt) {
    const handleObj: any = inject('handleObj')
    const pageMap: any = ref(handleObj.currentPageData)
    const preRenderContainer: any = ref()
    watch(
      () => handleObj.currentPageData,
      (newV: any, oldV: any) => {
        pageMap.value = newV
        renderBackground(pageMap.value.setting, preRenderContainer.value);
      }
    )

    return () => (
      <div class={styles.preRender} tabindex="-1" ref={preRenderContainer}>
        {renderText(pageMap.value.item.text)}
        {renderImage(pageMap.value.item.image)}
      </div>
    )
  },
})
