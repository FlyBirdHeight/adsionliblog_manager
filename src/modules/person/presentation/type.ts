type Animation = {
    join: {
        type: string,
        timer: number,
        level: number
    },
    leave: {
        type: string,
        timer: number,
        level: number
    }
}
type PageItem = {
    type: string,
    position: {
        x: number,
        y: number
    },
    data: any,
    layer: number,
    animation: {
        join: Animation,
        leave: Animation,
    },
    index: string
}

type Action = {
    type: string,
    page?: number,
    item_index?: string,
    action: string,
    data?: Page | PageItem | { pre: Page | PageItem, next: Page | PageItem }
}

type Page = {
    item: {
        text: any[],
        image: any[],
        code: any[],
        count: 0
    },
    setting: {
        background: {
            type: '',
            data: '',
            config: null,
        },
        resolution: {
            x: 1600,
            y: 900,
        },
    }
}

type CopyObj = {
    index: string | number,
    type: string
}

export {
    Animation,
    CopyObj,
    Page,
    Action,
    PageItem
}