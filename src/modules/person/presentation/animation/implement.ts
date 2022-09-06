import { AnimateOrder, AnimateList, AnimatePage } from "./type/animate"
import { Page, PageAnimate } from '../type'
import { setPageAnimate, setItemAnimate } from "./utils/data_setting"
import { AnimateStatus } from "./enum/animate_enum"
import { playAnimate } from './utils/timeline'
class ImplementAnimate {
    /**
     * @property {Map<string, AnimateOrder>} autoImplementStack 自动播放任务栈
     * @property {Map<string, AnimateOrder>} activeTrigger 主动触发任务栈
     * @property {Map<number, AnimateOrder>} execuationOrder 顺序执行栈
     * @property {Map<string, AnimateOrder>} execuatedStack 已执行任务栈
     * @property {AnimateList[]} showList 动画展示列表数据
     * @property {string} status 当前动画进行状态
     * @property {string | null} pauseOrder 暂停时执行动画位置指针
     */
    autoImplementStack: Map<string, AnimateOrder>
    activeTrigger: Map<string, AnimateOrder>
    execuationOrder: Map<number, AnimateOrder>
    showList: AnimateList[]
    execuatedStack: Map<string, AnimateOrder>
    pageAnimate: AnimatePage
    status: string
    pauseOrder: string | null
    setPageAnimate!: (pageAnimate: PageAnimate) => void
    setItemAnimate!: (itemAnimate: any) => void
    playAnimate!: (this: any, animateList: AnimateOrder[]) => void
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
        this.status = AnimateStatus.Ready;
        this.pauseOrder = null
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
        if (this.status === AnimateStatus.Pause) {
            this.status = AnimateStatus.Running;
            console.log(this.pauseOrder);
        } else {
            this.status = AnimateStatus.Running;
            if (this.pageAnimate.in.type != '') {
                
            }
        }

    }
    /**
     * @method parseTask 暂停动画执行
     */
    parseTask() {
        if (this.status != AnimateStatus.Running) {
            return;
        }
        this.status = AnimateStatus.Pause;
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
        this.pauseOrder = null;
        this.status = AnimateStatus.Ready;
    }
}

ImplementAnimate.prototype.setPageAnimate = setPageAnimate;
ImplementAnimate.prototype.setItemAnimate = setItemAnimate;
ImplementAnimate.prototype.playAnimate = playAnimate;


export default ImplementAnimate;