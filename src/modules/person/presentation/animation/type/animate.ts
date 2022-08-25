type Animate = {
    time: number,
    action: string,
    mode: string
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
 * @property {string} label 执行内容名称
 * @property {string} mode 触发方式
 */
type AnimateList = {
    itemIndex: string,
    type: string,
    label: string,
    mode: string
}
/**
 * @type AnimateOrder 动画执行属性
 * @property {AnimateList}
 * @property {Animate} action 动画属性
 */
type AnimateOrder = AnimateList & { action: Animate }


export {
    Animate,
    AnimateType,
    AnimateOrder,
    AnimateList
}