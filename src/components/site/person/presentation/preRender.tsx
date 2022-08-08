import { defineComponent, inject, ref, watch } from 'vue'
import PresentationText from '@/modules/person/presentation/text/text.vue'
import PresentationImage from '@/modules/person/presentation/image/image.vue'

function renderText(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = PresentationText;
  return data.map((text: any) => {
    return <tag info={text} />
  })
}
function renderImage(data: any[]) {
  if (data.length == 0) {
    return
  }
  const tag: any = PresentationImage;
  return data.map((image: any) => {
      console.log(image)
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
      <div class="presentation_body" tabindex="-1">
        {renderText(pageMap.value.item.text)}
        {renderImage(pageMap.value.item.image)}
      </div>
    )
  },
})
