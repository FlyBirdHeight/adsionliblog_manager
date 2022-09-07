let pageAnimate = {
    in: {
        type: 'fly-in',
        time: 2000,
        status: false
    },
    out: {
        type: 'fly-out',
        time: 1500,
        status: false
    }
}

let itemAnimate = [
    {
        itemIndex: '123456',
        type: 'clip-in',
        icon: '',
        mode: 'in',
        trigger: 'click',
        action: {
            time: 2000,
            action: 'clip-in',
            options: {
                show: false
            }
        }
    },
    {
        itemIndex: '456789',
        type: 'clip-in',
        icon: '',
        mode: 'in',
        trigger: 'auto',
        action: {
            time: 2000,
            action: 'clip-in',
            options: {
                show: false
            }
        }
    },
    {
        itemIndex: '123567',
        type: 'clip-in',
        icon: '',
        mode: 'in',
        trigger: 'click',
        action: {
            time: 2000,
            action: 'clip-in',
            options: {
                show: false
            }
        }
    },
    {
        itemIndex: '123456',
        type: 'clip-out',
        icon: '',
        mode: 'out',
        trigger: 'auto',
        action: {
            time: 2000,
            action: 'clip-out',
            options: {
                show: false
            }
        }
    },
    {
        itemIndex: '456789',
        type: 'clip-out',
        icon: '',
        mode: 'out',
        trigger: 'auto',
        action: {
            time: 2000,
            action: 'clip-out',
            options: {
                show: false
            }
        }
    },
    {
        itemIndex: '123567',
        type: 'clip-out',
        icon: '',
        mode: 'out',
        trigger: 'click',
        action: {
            time: 2000,
            action: 'clip-out',
            options: {
                show: false
            }
        }
    }
]

let execuateStack = [
    {
        order: 1,
        itemIndex: '123456',
        mode: 'in'
    },
    {
        order: 2,
        itemIndex: '456789',
        mode: 'in'
    },
    {
        order: 3,
        itemIndex: '123567',
        mode: 'in'
    },
    {
        order: 4,
        itemIndex: '123456',
        mode: 'out'
    },
    {
        order: 5,
        itemIndex: '456789',
        mode: 'out'
    },
    {
        order: 6,
        itemIndex: '123567',
        mode: 'out'
    }
]

export {
    pageAnimate,
    itemAnimate,
    execuateStack
}