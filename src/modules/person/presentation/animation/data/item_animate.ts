type ItemAnimateSelect = {
    value: string,
    label: string,
    icon: string
    children?: ItemAnimateSelect[]
}

const AnimateSelect: ItemAnimateSelect[] = [
    {
        value: 'in',
        label: '进入',
        icon: 'DArrowRight',
        children: [
            {
                value: 'opacity',
                label: '淡入',
                icon: '',
            },
            {
                value: 'fly-in',
                label: '飞入',
                icon: '',
            },
            {
                value: 'scale-in',
                label: '放缩',
                icon: '',
            }
        ]
    },
    {
        value: 'out',
        label: '退出',
        icon: 'DArrowLeft',
        children: [
            {
                value: 'opacity',
                label: '淡出',
                icon: '',
            },
            {
                value: 'fly-out',
                label: '飞出',
                icon: '',
            },
            {
                value: 'scale-out',
                label: '放缩',
                icon: '',
            }
        ]
    }
]
const AnimateInfo = {
    "fly": [
        {
            label: "底部",
            value: 'bottom'
        },
        {
            label: '左侧',
            value: 'left'
        },
        {
            label: '右侧',
            value: 'right'
        },
        {
            label: '顶部',
            value: 'top'
        },
    ],
    "scale": [
        {
            label: "从小到大",
            value: 'small'
        },
        {
            label: "从大到小",
            value: 'big'
        },
    ],

}
export {
    ItemAnimateSelect,
    AnimateSelect,
    AnimateInfo
};