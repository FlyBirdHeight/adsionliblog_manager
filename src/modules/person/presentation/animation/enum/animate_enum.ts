/**
 * @enum 动画状态枚举
 * @property {string} Ready 准备运行
 * @property {string} Running 运行中
 * @property {string} Pause 暂停
 * @property {string} Complete 全部运行完成
 * @property {string} WaitTrigger 鼠标点击触发动画的话，会暂停等待触发的状态
 */
enum AnimateStatus {
    Ready = 'Ready',
    PageIn = 'PageIn',
    Running = 'Running',
    Pause = 'Pause',
    PageOut = 'PageOut',
    Complete = 'Complete',
    WaitTrigger = 'WaitTrigger'
}


export {
    AnimateStatus
}