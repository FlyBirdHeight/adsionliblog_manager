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
                value: 'openUp-in',
                label: '上侧荡入',
                icon: ''
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
                value: 'openUp-out',
                label: '上侧荡出',
                icon: ''
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
            label: "普通放缩",
            value: 'normal'
        },
        {
            label: "模糊放缩",
            value: 'blur'
        },
    ],
    "openUp": [
        {
            label: "左侧",
            value: 'left'
        },
        {
            label: "右侧",
            value: 'right'
        }
    ]

}
export {
    ItemAnimateSelect,
    AnimateSelect,
    AnimateInfo
};