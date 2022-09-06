import { AnimateOrder, PageAnimateAction } from "../type/animate";
import { AnimateStatus } from '../enum/animate_enum';

/**
 * @description 本文件主要处理动画的定时播放的进行
 */
const playAnimate = function (this: any, animateList: AnimateOrder[], isClick: boolean = false) {
    let that = this;
    if (animateList.length === 0) {
        return;
    }
    if (animateList.length === 0) {
        this.status = AnimateStatus.PageOut;
        this.playPage();
        return;
    }
    let animateTask: any = animateList.shift();
    if (animateTask === 'auto' || (animateTask === 'click' && isClick)) {
        animateTask.action.options.show = true;
    } else if (animateTask === 'click' && !isClick) {
        animateList.unshift(animateTask);
        this.status = AnimateStatus.WaitTrigger;
        return;
    }
    setTimeout(() => {
        if (this.status === AnimateStatus.Complete) {
            return;
        }
        if (that.status == AnimateStatus.Pause) {
            return;
        }
        if (that.status == AnimateStatus.Running) {
            if (animateList.length === 0) {
                that.status = AnimateStatus.PageOut;
                that.playPage();
                return;
            }
            let runningTask: any = animateList.shift();
            that.execuationOrder.delete(that.execuationOrder.size - animateList.length);
            if (runningTask?.trigger === 'auto') {
                runningTask.action.options.show = true;
                return playAnimate.call(that, animateList);
            } else {
                that.status = AnimateStatus.WaitTrigger;
                animateList.unshift(runningTask);
                return;
            }
        }
    }, animateTask.action.time)
}
const playPage = function (this: any): Promise<boolean> {
    let animate: PageAnimateAction;
    if (this.status === AnimateStatus.PageIn) {
        animate = this.pageAnimate.in;
    } else {
        animate = this.pageAnimate.out;
    }
    console.log(animate);
    animate.status.value = !animate.status.value;
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