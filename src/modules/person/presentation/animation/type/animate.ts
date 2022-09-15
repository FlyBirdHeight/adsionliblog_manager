type Animate = {
    time: number,
    action: string,
    options?: any
}
/**
 * @type AnimateType 控件动画内容
 * @property {Animate} enter 控件标识
 * @property {Animate} leave 执行类型
 */
type AnimateType = {
    enter?: Animate,
    leave?: Animate
}
/**
 * @type AnimateList 动画可视化列表显示
 * @property {string} itemIndex 控件标识
 * @property {string} type 执行类型
 * @property {string} icon 执行内容图标
 * @property {string} mode 触发方式
 */
type AnimateList = {
    itemIndex: string,
    type: string,
    icon: string,
    mode: 'in' | 'out',
    trigger: 'click' | 'auto'
}
/**
 * @type AnimateOrder 动画执行属性
 * @property {AnimateList}
 * @property {Animate} action 动画属性
 */
type AnimateOrder = AnimateList & { action: Animate }
type PageAnimateAction = {
    type: string,
    time: number,
    status: any,
}
type AnimatePage = {
    in: PageAnimateAction,
    out: PageAnimateAction
}
type ItemAnimate = {
    in: {
        type: string,
        time: number,
        trigger: string,
        info?: any,
        order?: number,
        speed: any,
    },
    out: {
        type: string,
        time: number,
        trigger: string,
        info?: any,
        order?: number,
        speed: any,
    },
    show: boolean
}
export {
    Animate,
    AnimateType,
    AnimateOrder,
    AnimateList,
    AnimatePage,
    PageAnimateAction,
    ItemAnimate
}