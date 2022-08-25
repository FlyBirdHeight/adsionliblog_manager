import { AnimateOrder, AnimateList } from "./type/animate"
class ImplementAnimate {
    /**
     * @property {AnimateOrder[]} autoImplementStack 自动播放任务栈
     * @property {AnimateOrder[]} activeTrigger 主动触发任务栈
     * @property {AnimateOrder[]} execuationOrder 顺序执行栈
     * @property {AnimateList[]} showList 动画展示列表数据
     */
    autoImplementStack: AnimateOrder[]
    activeTrigger: AnimateOrder[]
    execuationOrder: AnimateOrder[]
    showList: AnimateList[]
    constructor() {
        this.autoImplementStack = [];
        this.activeTrigger = [];
        this.execuationOrder = [];
        this.showList = [];
    }
    /**
     * @method setTask 设置动画执行任务
     */
    setTask() {

    }
    /**
     * @method runTask 运行动画执行任务
     */
    runTask() {

    }
    /**
     * @method parseTask 暂停动画执行
     */
    parseTask() {

    }

    /**
     * @method quickRunning 加速动画执行
     */
    quickRunning() {

    }

    /**
     * @method triggerClick 触发点击执行
     */
    triggerClick() {

    }

    /**
     * @method executeNow 立即执行完成
     */
    executeNow() {

    }

    /**
     * @method changePageTrigger 切换页面后，重新生成相关列表
     */
    changePageTrigger() {

    }
}

export default ImplementAnimate;