import { ElButton } from 'element-plus'
import { withModifiers } from 'vue'
export default function useHandleList(animateObj: any) {
  const toolList: { label: string; action: string }[] = [
    {
      label: '开始',
      action: 'start',
    },
    {
      label: '暂停',
      action: 'pause',
    },
    {
      label: '点击触发',
      action: 'click',
    },
    {
      label: '快进',
      action: 'forward',
    },
    {
      label: '直接完成',
      action: 'end',
    },
    {
      label: '重置',
      action: 'restart',
    },
  ]
  const handleClick = (action: string) => {
    switch (action) {
      case 'start':
        animateObj.runTask()
        break
      case 'parse':
        animateObj.pauseTask()
        break
      case 'click':
        animateObj.triggerClick()
        break
      case 'forward':
        animateObj.quickRunning()
        break
      case 'end':
        animateObj.executeNow()
        break
      case 'restart':
        animateObj.restartTask()
      default:
        break
    }
  }

  const getHandleDom = () => {
    let arr: any[] = []
    for (let task of toolList) {
      arr.push(
        <ElButton
          onClick={withModifiers(() => {
            handleClick(task.action)
          }, ['stop'])}
          style="width: 80px;height: 40px; margin: 1px 0 !important"
        >
          {task.label}
        </ElButton>
      )
    }

    return arr
  }

  return {
    getHandleDom,
  }
}
