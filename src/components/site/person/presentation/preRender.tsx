import { defineComponent, inject, ref, watch } from 'vue'
import ShowText from '@/modules/person/presentation_show/component/text.tsx'
import ShowImage from '@/modules/person/presentation_show/component/image.tsx'

function renderText(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = ShowText
  return data.map((text: any) => {
    return <tag info={text} />
  })
}
function renderImage(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = ShowImage
  return data.map((image: any) => {
    return <tag info={image} />
  })
}

export default defineComponent({
  name: 'PreRenderContainer',
  setup(props, cxt) {
    const handleObj: any = inject('handleObj')
    const pageMap: any = ref(handleObj.currentPageData)
    watch(
      () => handleObj.currentPageData,
      (newV: any, oldV: any) => {
        pageMap.value = newV
      }
    )
    return () => (
      <div class="presentation_body" style="position:relative; width: 1000px; height: 750px" tabindex="-1">
        {renderText(pageMap.value.item.text)}
        {renderImage(pageMap.value.item.image)}
      </div>
    )
  },
})
