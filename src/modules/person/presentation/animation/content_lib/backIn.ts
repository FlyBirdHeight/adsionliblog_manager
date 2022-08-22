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

export default {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave
};