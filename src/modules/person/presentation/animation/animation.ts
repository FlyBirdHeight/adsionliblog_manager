interface AnimateAction {
    duration: number;
    enter: (el: any, done: any) => void;
    afterEenter: (el: any) => void;
    leave: (el: any, done: any) => void;
    beforeEnter: (el: any) => void;
    beforeLeave: (el: any) => void;
    afterLeave: (el: any) => void;
}

export default AnimateAction