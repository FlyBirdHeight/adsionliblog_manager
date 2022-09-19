import { AnimateOrder, PageAnimateAction } from "../type/animate";
import { AnimateStatus } from '../enum/animate_enum';

/**
 * @description 本文件主要处理动画的定时播放的进行
 */
const playAnimate = function (this: any, info: { order: number[], animate: AnimateOrder[] }, isClick: boolean = false) {
    let that = this;
    let animateList = info.animate;
    let orderList = info.order;
    if (animateList.length === 0) {
        this.status = AnimateStatus.PageOut;
        return;
    }
    let animateTask: any = animateList.shift();
    let order: any = orderList.shift();
    if (animateTask.action.trigger === 'auto' || (animateTask.action.trigger === 'click' && isClick)) {
        animateTask.item.show = !animateTask.item.show;
        this.execuationOrder.delete(order);
        this.execuatedStack.set(order, animateTask);
    } else if (animateTask.action.trigger === 'click' && !isClick) {
        this.status = AnimateStatus.WaitTrigger;
        return;
    }
    setTimeout(() => {
        if (this.status === AnimateStatus.PageOut) {
            return;
        }
        if (that.status == AnimateStatus.Pause) {
            return;
        }
        if (that.status == AnimateStatus.Running) {
            if (animateList.length === 0) {
                that.status = AnimateStatus.PageOut;
                console.log('end', that.status)
                return;
            }
            return playAnimate.call(that, { order: orderList, animate: animateList });
        }
    }, Math.floor(animateTask.action.time / animateTask.action.speed) + this.intervalTime);
}
const playPage = function (this: any): Promise<boolean> {
    let animate: PageAnimateAction;
    if (this.status === AnimateStatus.PageIn) {
        animate = this.pageAnimate.in;
    } else {
        animate = this.pageAnimate.out;
    }
    console.log(animate);
    //NOTE: 具体实现后再打开，用来控制显隐的
    // animate.status.value = !animate.status.value;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, animate.time)
    })
}

export {
    playAnimate,
    playPage
}