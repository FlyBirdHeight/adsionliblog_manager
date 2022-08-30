import { ImageItem } from './image/type'
import { TextItem } from './text/type'

type PageItem = ImageItem | TextItem

type Action = {
    type: string,
    page?: number,
    item_index?: string | number,
    action: string,
    data?: { pre: Page | PageItem | null, next: PageItem | Page | null },
    timeStamp: number,
    itemEditType?: string
}
/**
 * @type ItemAnimateList
 * @property {number} duration 动画时长
 * @property {string} itemIndex item标识
 * @property {string} itemType item类型
 * @property {string} action 进入还是出去
 * @property {string} type 动画类型
 * @property {number} index 执行顺序编号
 */
type ItemAnimateList = {
    duration: number,
    itemIndex: string,
    itemType: string,
    action: string,
    type: string,
    index: number
}

type PageBack = {
    background: {
        type: string,
        data: string,
        config: null,
        image?: {
            url: string,
            localUrl: string
        }
    },
    resolution: {
        x: number,
        y: number,
    },
}
type PageAnimate = {
    in: {
        type: string,
        time: number
    },
    out: {
        type: string,
        time: number
    },
    item?: {
        enter: ItemAnimateList[],
        leave: ItemAnimateList[]
    }
}
type Page = {
    item: {
        text: any[],
        image: any[],
        code: any[],
        count: 0
    },
    setting: PageBack,
    animate: PageAnimate,
    isEdit: boolean,
    page_key?: string,
    id?: number
}

type ItemInfo = {
    index: string,
    type: string
}

type CopyObj = {
    index: string | number,
    type: string
}

export {
    CopyObj,
    Page,
    Action,
    PageItem,
    ItemInfo,
    PageBack,
    PageAnimate
}