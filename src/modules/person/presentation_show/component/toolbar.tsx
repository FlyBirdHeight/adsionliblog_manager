import { defineComponent, getCurrentInstance } from 'vue'
//NOTE: css
import styles from './scss/toolbar.module.scss'
//NOTE: hooks
import useGlobeData from '../../../../components/hooks/useGlobeData'
import useToolbarList from './hooks/useToolbarList'
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
    const instance: any = getCurrentInstance();
    const globalData = useGlobeData(instance);
    const { toolList, getToolButton } = useToolbarList({}, globalData)
    return () => <div class={styles.toolbar_container}>{getToolButton(instance.ctx.$el)}</div>
  },
})

export default PreViewToolbar
