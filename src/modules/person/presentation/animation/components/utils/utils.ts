type Setting = { type: string, attribute: string, speed: number, task: string, trigger: string }
type WaitSetting = {
    info: any,
    speed: number,
    time: number,
    trigger: string,
    type: string,
    order?: number
}
export function setAnimateChoice(setting: any, type: string, itemInfo: any, animateObj: any) {
    let set: Setting = setting[type];
    let waitSet: WaitSetting = itemInfo.animate[type];
    waitSet.speed = set.speed;
    waitSet.trigger = set.trigger;
    waitSet.type = set.type;
    waitSet.info = { show: false, attribute: set.attribute };
    animateObj.addAnimate(itemInfo, waitSet, type);
}

export {
    Setting,
    WaitSetting
}