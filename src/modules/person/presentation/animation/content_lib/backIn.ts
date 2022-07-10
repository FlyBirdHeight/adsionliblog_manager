//进入
const onBeforeEnter = function (el: any) {
    el!.style.opacity = 0;
}
const onEnter = function (el: any, done: any) {
    el!.style.opacity = 0;
    el!.style.transition = 'all 1.5s linear'
    done();
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
    el!.style.opacity = 1;
    el!.style.transition = 'all 1.5s linear'
    done();
}
const onAfterLeave = function (el: any) {
    el!.style.opacity = 0;
}
const BackIn = function (this: any) {
    this.duration = 1000;
}

Reflect.setPrototypeOf(BackIn, {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave
})

export default BackIn;