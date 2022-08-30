import { AnimateOrder, AnimateList, AnimatePage } from "./type/animate"
import { Page, PageAnimate } from '../type'
import { setPageAnimate, setItemAnimate } from "./utils/data_setting"
class ImplementAnimate {
    /**
     * @property {Map<string, AnimateOrder>} autoImplementStack 自动播放任务栈
     * @property {Map<string, AnimateOrder>} activeTrigger 主动触发任务栈
     * @property {Map<number, AnimateOrder>} execuationOrder 顺序执行栈
     * @property {Map<string, AnimateOrder>} execuatedStack 已执行任务栈
     * @property {AnimateList[]} showList 动画展示列表数据
     */
    autoImplementStack: Map<string, AnimateOrder>
    activeTrigger: Map<string, AnimateOrder>
    execuationOrder: Map<number, AnimateOrder>
    showList: AnimateList[]
    execuatedStack: Map<string, AnimateOrder>
    pageAnimate: AnimatePage
    setPageAnimate!: (pageAnimate: PageAnimate) => void
    setItemAnimate!: (itemAnimate: any) => void
    constructor() {
        this.pageAnimate = {
            in: { type: '', time: 1000, status: false },
            out: { type: '', time: 1000, status: false }
        }
        this.autoImplementStack = new Map();
        this.activeTrigger = new Map();
        this.execuationOrder = new Map();
        this.showList = [];
        this.execuatedStack = new Map();
    }
    /**
     * @method setTask 设置动画执行任务
     * @param {Page | null} pageInfo 页面信息
     */
    setTask(pageInfo: Page | null) {
        if (!pageInfo) return;
        this.setPageAnimate(pageInfo!.animate);
        this.setItemAnimate(pageInfo.item);
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

    /**
     * @method cleatStack 清空动画栈全部内容
     */
    clearStack() {
        this.autoImplementStack.clear();
        this.activeTrigger.clear();
        this.execuationOrder.clear();
        this.showList = [];
        this.execuatedStack.clear();
    }
}

ImplementAnimate.prototype.setPageAnimate = setPageAnimate;
ImplementAnimate.prototype.setItemAnimate = setItemAnimate;


export default ImplementAnimate;