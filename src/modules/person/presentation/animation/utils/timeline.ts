import { AnimateOrder } from "../type/animate";
import { AnimateStatus } from '../enum/animate_enum';

/**
 * @description 本文件主要处理动画的定时播放的进行
 */
const playAnimate = function (this: any, animateList: AnimateOrder[]) {
    let that = this;
    if (animateList.length === 0) {
        return;
    }
    setTimeout(() => {
        if (that.status == AnimateStatus.Pause) {
            that.pauseOrder = animateList[0];
            return;
        }
        if (that.status == AnimateStatus.Running) {
            let runningTask = animateList.shift();
            if (runningTask?.trigger === 'auto') {
                runningTask.action.options.show = true;
                return playAnimate.call(that, animateList);
            } else {
                that.status = AnimateStatus.WaitTrigger;
                return;
            }
        }
    }, animateList[0].action.time)
}