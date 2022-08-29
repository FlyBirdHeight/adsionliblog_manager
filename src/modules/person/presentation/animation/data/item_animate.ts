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
                value: '',
                label: '',
                icon: '',
            }
        ]
    },
    {
        value: 'leave',
        label: '退出',
        icon: 'DArrowLeft',
        children: [
            {
                value: '',
                label: '',
                icon: '',
            }
        ]
    }
]

export {
    ItemAnimateSelect,
    AnimateSelect
};