import { AnimateOrder, AnimateList, AnimatePage } from "./type/animate"
import { Page, PageAnimate } from '../type'
import { setPageAnimate, setItemAnimate, addAnimate } from "./utils/data_setting"
import { AnimateStatus } from "./enum/animate_enum"
import { playAnimate, playPage } from './utils/timeline'
import { WaitSetting } from './components/utils/utils'
class ImplementAnimate {
    /**
     * @property {Map<string, AnimateOrder>} autoImplementStack 自动播放任务栈
     * @property {Map<string, AnimateOrder>} activeTrigger 主动触发任务栈
     * @property {Map<number, AnimateOrder>} execuationOrder 顺序执行栈
     * @property {Map<string, AnimateOrder>} execuatedStack 已执行任务栈
     * @property {AnimateList[]} showList 动画展示列表数据
     * @property {string} status 当前动画进行状态
     * @property {number} actionSpeed 播放速度
     */
    autoImplementStack: Map<string, AnimateOrder>
    activeTrigger: Map<string, AnimateOrder>
    execuationOrder: Map<number, AnimateOrder>
    showList: AnimateList[]
    execuatedStack: Map<number, AnimateOrder>
    pageAnimate: AnimatePage
    status: string
    actionSpeed: number
    setPageAnimate!: (pageAnimate: PageAnimate) => void
    setItemAnimate!: (itemAnimate: any) => void
    playAnimate!: (animateList: { order: number[], animate: AnimateOrder[] }, isClick?: boolean) => void
    playPage!: () => Promise<boolean>
    addAnimate!: (item: any, setting: WaitSetting, mode: string) => void;
    constructor() {
        this.pageAnimate = {
            in: { type: '', time: 1000, status: false },
            out: { type: '', time: 1000, status: true }
        }
        this.autoImplementStack = new Map();
        this.activeTrigger = new Map();
        this.execuationOrder = new Map();
        this.showList = [];
        this.execuatedStack = new Map();
        this.status = AnimateStatus.Ready;
        this.actionSpeed = 1;
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
    async runTask() {
        let playAnimate = this.getAnimateList();
        console.log('ready')
        if (this.status === AnimateStatus.Pause) {
            this.status = AnimateStatus.Running;
            this.playAnimate(playAnimate);
        } else {
            this.status = AnimateStatus.PageIn;
            if (this.pageAnimate.in.type != '') {
                await this.playPage();
            }
            this.status = AnimateStatus.Running;
            console.log(this.status)
            this.playAnimate(playAnimate);
        }
    }
    /**
     * @method parseTask 暂停动画执行
     */
    pauseTask() {
        if (this.status != AnimateStatus.Running) {
            return;
        }
        this.status = AnimateStatus.Pause;
    }

    /**
     * @method quickRunning 加速动画执行
     */
    quickRunning() {
        this.actionSpeed += 0.5;
    }

    /**
     * @method triggerClick 触发点击执行
     */
    triggerClick() {
        if (this.status !== AnimateStatus.WaitTrigger) {
            return;
        }
        this.status = AnimateStatus.Running;
        this.playAnimate(this.getAnimateList(), true);
    }

    /**
     * @method executeNow 立即执行完成
     */
    executeNow() {
        for (let [key, value] of this.execuationOrder) {
            let index: string = value.itemIndex + '-' + value.mode;
            let task: any = this.activeTrigger.has(index) ? this.activeTrigger.get(index) : this.autoImplementStack.get(index);
            task.item.show = true;
            this.execuatedStack.set(key, value)
        }
        this.execuationOrder.clear();
        this.status = AnimateStatus.PageOut;
    }
    /**
     * @method restartTask 重置动画执行
     */
    restartTask() {
        for (let [key, value] of this.execuatedStack) {
            let index: string = value.itemIndex + '-' + value.mode;
            let task: any = this.activeTrigger.has(index) ? this.activeTrigger.get(index) : this.autoImplementStack.get(index);
            task.item.show = false;
            this.execuationOrder.set(key, value)
        }
        this.execuatedStack.clear();
        this.status = AnimateStatus.Ready;
        this.pageAnimate.in.status = false;
        this.pageAnimate.out.status = true;
    }

    /**
     * @method changePageTrigger 切换页面后，重新生成相关列表
     */
    changePageTrigger() {

    }

    /**
     * @method getAnimateList 获取播放动画列表
     * @return {AnimateList[]}
     */
    getAnimateList(): { order: number[], animate: AnimateOrder[] } {
        let res: { order: number[], animate: AnimateOrder[] } = { order: [], animate: [] };
        for (let [key, value] of this.execuationOrder) {
            res.order.push(key);
        }
        res.order.sort((a, b) => a - b);
        if (res.order.length != 0) {
            for (let order of res.order) {
                let itemInfo: any = this.execuationOrder.get(order);
                let key: string = itemInfo.itemIndex + '-' + itemInfo.mode;
                let task: any = this.activeTrigger.has(key) ? this.activeTrigger.get(key) : this.autoImplementStack.get(key);
                res.animate.push(task)
            }
        }
        return res;
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
        this.status = AnimateStatus.Ready;
    }
}

ImplementAnimate.prototype.setPageAnimate = setPageAnimate;
ImplementAnimate.prototype.setItemAnimate = setItemAnimate;
ImplementAnimate.prototype.playAnimate = playAnimate;
ImplementAnimate.prototype.playPage = playPage;
ImplementAnimate.prototype.addAnimate = addAnimate;


export default ImplementAnimate;