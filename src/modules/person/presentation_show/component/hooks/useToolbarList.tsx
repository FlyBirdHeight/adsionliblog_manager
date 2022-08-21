import { withModifiers, ref } from 'vue'
import { ElButton, ElButtonGroup } from 'element-plus'
import { ElTooltip } from 'element-plus/lib/components'
export default function ToolbarList(pageInfo: any, globalData: any) {
  const toolList: { icon: string; action: string; label: string }[] = [
    {
      icon: 'Back',
      action: 'pre',
      label: '上一页',
    },
    {
      icon: 'Top',
      action: 'preDo',
      label: '上一步',
    },
    {
      icon: 'RefreshRight',
      action: 'refresh',
      label: '重放',
    },
    {
      icon: 'Bottom',
      action: 'nextDo',
      label: '下一步',
    },
    {
      icon: 'Right',
      action: 'next',
      label: '下一页',
    },
  ]
  const handleClick = (action: string) => {
    switch (action) {
      case 'pre':
        break
      case 'next':
        break
      case 'refresh':
        break
      case 'preDo':
        break
      case 'nextDo':
        break
    }
  }
  const getToolButton = (container: any) => {
    let arr: any[] = []
    for (let handle of toolList) {
      arr.push(
        <ElTooltip effect="light" style="z-index: 1048587 !important" teleported={true} content={handle.label} placement="bottom">
          <ElButton
            icon={globalData.$icon[handle.icon]}
            onClick={withModifiers(() => {
              handleClick(handle.action)
            }, ['stop'])}
            size={'large'}
          />
        </ElTooltip>
      )
    }

    return (
      <ElButtonGroup class="preViewtoolList" ref="preViewToolList">
        {arr.map((v) => v)}
      </ElButtonGroup>
    )
  }

  return {
    toolList,
    getToolButton,
  }
}
