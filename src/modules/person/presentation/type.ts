import { ImageItem } from './image/type'
import { TextItem } from './text/type'

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
type PageItem = ImageItem | TextItem

type Action = {
    type: string,
    page?: number,
    item_index?: string | number,
    action: string,
    data?: { pre: Page | PageItem | null, next: Page | PageItem | null },
    timeStamp: number
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