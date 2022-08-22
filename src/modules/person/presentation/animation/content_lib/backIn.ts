import AnimateAction from '../animation';

//进入
const onBeforeEnter = function (el: any) {
    el!.style.opacity = 0;
}
const onEnter = function (el: any, done: any) {
    el!.style.transition = 'opacity 1s linear'
    setTimeout(() => {
        el!.style.opacity = 1;
        done();
    }, 1000)
}
const onAfterEnter = function (el: any) {
    el!.style.opacity = 1;
}
const onEnterCancelled = function (el: any) {

}
//离开
const onBeforeLeave = function (el: any) {
    el!.style.opacity = 1;

}
const onLeave = function (el: any, done: any) {
    el!.style.opacity = 0;
    el!.style.transition = 'opacity 1s linear'
    setTimeout(() => {
        done();
    }, 1000)
}
const onAfterLeave = function (el: any) {
    el!.style.opacity = 0;
}

class BackIn implements AnimateAction  {
    duration: number
    enter!: (el: any, done: any) => void;
    afterEenter!: (el: any) => void;
    leave!: (el: any, done: any) => void;
    beforeEnter!: (el: any) => void;
    beforeLeave!: (el: any) => void;
    afterLeave!: (el: any) => void;
    constructor(duration: number = 1000) {
        this.duration = duration;
    }
}
BackIn.prototype.enter = onEnter;
BackIn.prototype.beforeEnter = onBeforeEnter;
BackIn.prototype.afterEenter = onAfterEnter;
BackIn.prototype.leave = onLeave;
BackIn.prototype.beforeLeave = onBeforeLeave;
BackIn.prototype.afterLeave = onAfterLeave;

export default BackIn;