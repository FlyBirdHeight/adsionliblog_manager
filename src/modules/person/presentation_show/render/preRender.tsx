import {
  defineComponent,
  inject,
  ref,
  watch,
  nextTick,
  Teleport,
  withModifiers,
  getCurrentInstance,
  provide,
  vShow,
  withDirectives,
} from 'vue'
//NOTE: css
import styles from './scss/preRender.module.scss'
//NOTE: components
import { ElButton } from 'element-plus'
import ShowText from '@/modules/person/presentation_show/component/text.tsx'
import ShowImage from '@/modules/person/presentation_show/component/image.tsx'
import PreViewToolbar from '@/modules/person/presentation_show/component/toolbar.tsx'
import ItemAnimation from '@/modules/person/presentation/animation/item_animation.vue'
//NOTE: utils
import { ImageItem } from '../../presentation/image/type'
import { TextItem } from '../../presentation/text/type'
import { PageBack } from '../../presentation/type'
import { analysisBackground, getAnalysisBackgroundStyle } from '@/modules/person/presentation/utils/item'
import { generatePageImage } from '../../presentation/utils/utils'
//NOTE: hooks
import useGlobeData from '../../../../components/hooks/useGlobeData'
import useFullScreenTeleport from './hooks/useFullScreenTeleport'
import useControl from './hooks/useControl'

function renderText(data: any) {
  if (data.length == 0) {
    return
  }
  const tag: any = ShowText
  return data.map((text: TextItem) => {
    return <tag info={text} />
  })
}
function renderImage(data: any) {
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
  if (!backgroundData) {
    return
  }
  let background = backgroundData.background
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
  let res = arr.map((v: any) => {
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
  return res
}

export default defineComponent({
  name: 'PreRenderContainer',
  emits: ['getRef', 'getPage', 'clostProjection'],
  props: {
    display: {
      type: Boolean,
      default: true,
    },
    flyToBody: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const globalData = useGlobeData(instance)
    const handleObj: any = inject('handleObj')
    const pageMap: any = ref(handleObj.currentPageData)
    const preRenderContainer = ref()
    const preRenderList = ref([])
    const pageImage = ref([])
    const pageCount = ref(handleObj.pageList.size)
    const pageList = ref(null)
    const firstRender = ref<boolean>(true)
    const teleportFullScreen = useFullScreenTeleport(handleObj, 'person-presentation', instance)
    const animate = ref('fly-left')
    const playTime = ref<number>(1000)
    const playPosition = useControl(playTime.value)

    provide('playPosition', playPosition)
    watch(
      () => handleObj.getData,
      async (newV: any, oldV: any) => {
        pageMap.value = handleObj.currentPageData
        emit('getRef', preRenderContainer.value)
        if (firstRender.value) {
          pageCount.value = handleObj.pageList.size
          pageList.value = handleObj.pageList
          firstRender.value = false
          nextTick(async () => {
            let promiseList = preRenderList.value.map((v: any, i: number) => {
              return generatePageImage(v, i + 1, pageImage.value)
            })
            await Promise.all(promiseList)
            emit('getPage', pageImage.value)
          })
        }
      }
    )
    return () => (
      <Teleport to={'body'} disabled={teleportFullScreen.value}>
        <div
          class={styles.renderContainer + ' renderContainer'}
          id="positionShowBack"
          onClick={withModifiers(() => {
            emit('clostProjection')
          }, ['stop'])}
          ref={preRenderContainer}
        >
          {props.flyToBody ? '' : <ElButton class={styles.closeBtn} circle icon={globalData.$icon['Close']} />}
          <ItemAnimation animate={animate.value} duration={playTime.value}>
            {withDirectives(
              <div
                class={styles.preRender}
                tabindex="-1"
                onClick={withModifiers(() => {}, ['stop'])}
                style={renderBackground(pageMap.value.setting, null, true)}
              >
                {renderText(pageMap.value.item.text)}
                {renderImage(pageMap.value.item.image)}
              </div>,
              [[vShow, props.display && !playPosition.value]]
            )}
          </ItemAnimation>
          {firstRender.value && !handleObj.isSave ? firstRenderPage(handleObj.pageList, preRenderList) : ''}
          <PreViewToolbar position={[1, 2]} />
        </div>
      </Teleport>
    )
  },
})
