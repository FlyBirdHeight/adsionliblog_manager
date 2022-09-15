import { defineComponent, getCurrentInstance, Teleport } from 'vue'
//NOTE: css
import styles from './scss/toolbar.module.scss'
//NOTE: hooks
import useGlobeData from '../../../../components/hooks/useGlobeData'
import useToolbarList from './hooks/useToolbarList'
import useAnimateObj from '../../presentation/animation/hooks/useAnimateObj'
import useHandleList from './hooks/useHandleList'
interface ToolbarProps {
  position: number[]
}
function getUtils() {
  let arr = []
}

const PreViewToolbar = defineComponent({
  emits: [],
  props: ['position'],
  setup(props: ToolbarProps, { emit }) {
    const instance: any = getCurrentInstance()
    const globalData = useGlobeData(instance)
    const { toolList, getToolButton } = useToolbarList(globalData)
    const animateObj = useAnimateObj()
    const handleList = useHandleList(animateObj)
    return () => (
      <Teleport to={'body'} disabled={true}>
        <div class={styles.toolbar_container}>{getToolButton(instance.ctx.$el)}</div>
        <div class={styles.toolbar_second_container}>{handleList.getHandleDom()}</div>
      </Teleport>
    )
  },
})

export default PreViewToolbar
