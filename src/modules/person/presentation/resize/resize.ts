const pointPositionType = {
    "left-top": 1,
    "top-center": 2,
    "right-top": 3,
    "right-center": 4,
    "right-bottom": 5,
    "bottom-center": 6,
    "left-bottom": 7,
    "left-center": 8
}
const cursorType = {
    1: "nw-resize",
    2: "n-resize",
    3: "ne-resize",
    4: "e-resize",
    5: "se-resize",
    6: "s-resize",
    7: "sw-resize",
    8: "w-resize"
}
const rotateType = [
    {
        min: 0,
        max: 23
    },
    {
        min: 23,
        max: 68,
    },
    {
        min: 68,
        max: 113,
    },
    {
        min: 113,
        max: 158,
    },
    {
        min: 158,
        max: 203,
    },
    {
        min: 203,
        max: 248,
    },
    {
        min: 248,
        max: 293,
    },
    {
        min: 293,
        max: 338,
    }
]
/**
 * @method calculateChangeWidthAndHeight 计算改变之后的宽高
 * @param {*} event 移动事件
 * @param {number} rotate 旋转角度
 * @param {*} parentDom 改变dom元素
 * @param {*} position 位置坐标
 * @param {string} type 移动类型
 */
const calculateChangeWidthAndHeight = (event: any, rotate: number, parentDom: any, position: any, type: number) => {
    let nH = 0, nW = 0;
    let mY = 0, mX = 0;
    let pB = parentDom.getBoundingClientRect();

    let x = event.clientX - pB.left;
    let y = event.clientY - pB.top;
    if (type === 2 || type === 3) {
        mY = position.bottom
        mX = position.left;
    } else if (type === 1) {
        mX = position.right;
        mY = position.bottom;
    } else if (type === 4 || type === 6 || type === 5) {
        mX = position.left;
        mY = position.top;
    } else if (type === 8 || type === 7) {
        mX = position.right;
        mY = position.top;
    }
    // console.log(y, mY);
    if (type === 2 || type === 6) {
        nH = Math.abs(y - mY)
        if (nH != 0) {
            nH = Math.abs(nH - 12);
        }
    } else if (type === 8 || type === 4) {
        nW = Math.abs(Math.floor(x) - Math.floor(mX));
        if (nW != 0) {
            nW = Math.abs(nW - 12);
        }
    } else {
        nH = Math.abs(Math.floor(y) - Math.floor(mY));
        nW = Math.abs(Math.floor(x) - Math.floor(mX));
        if (nW != 0) {
            nW = Math.abs(nW - 12);
        }
        if (nH != 0) {
            nH = Math.abs(nH - 12);
        }
    }

    return { nH, nW }
}


/**
 * @method changeLocation 处理定位问题
 * @param {string} type 定位点类型 
 * @param {*} element dom，需要修改其定位，用来修改其大小 
 * @param {*} parentDom 外部容器dom
 * @param {*} position 用于记录位置的position
 * @param {number} rotate 旋转角度
 */
const changeLocation = (type: string, element: any, parentDom: any, position: any, rotate: number, center: any) => {
    let { left, right, top, height, width } = parentDom.value.getBoundingClientRect();
    let { left: eLeft, right: eRight, top: eTop, height: eHeight, width: eWidth } = element.value.getBoundingClientRect()
    let hRotate = rotate % 360;
    if (hRotate < 0) {
        hRotate += 360;
    }
    let actionType = Reflect.get(pointPositionType, type);
    position.oldType = actionType;
    actionType = handleRotatePosition(hRotate, actionType);
    position.type = actionType;

    let xL = center.x - eWidth / 2;
    let yT = center.y - eHeight / 2;

    if (actionType === 3 || actionType === 2) {
        position.bottom = yT + eHeight;
        position.left = xL;
        if (rotate !== 0) {
            element.value.style.top = 'unset'
            element.value.style.right = 'unset'
            element.value.style.bottom = height - (yT + eHeight) + 'px';
            element.value.style.left = xL + 'px';
        }
    }
    if (actionType === 1) {
        position.bottom = yT + eHeight;
        position.right = xL + eWidth;
        if (rotate !== 0) {
            element.value.style.left = 'unset';
            element.value.style.top = 'unset';
            element.value.style.right = width - (xL + eWidth) + 'px';
            element.value.style.bottom = height - (yT + eHeight) + 'px';
        }
    }

    if (actionType === 8 || actionType === 7) {
        position.right = xL + eWidth;
        position.top = yT;
        if (rotate !== 0) {
            element.value.style.left = 'unset';
            element.value.style.bottom = 'unset';
            element.value.style.right = width - (xL + eWidth) + 'px';
            element.value.style.top = yT + 'px';
        }
    }
    if (actionType === 4 || actionType === 6 || actionType === 5) {
        position.top = yT;
        position.left = xL;
        if (rotate !== 0) {
            element.value.style.right = 'unset';
            element.value.style.bottom = 'unset';
            element.value.style.top = yT + 'px';
            element.value.style.left = xL + 'px';
        }
    }

    if (rotate !== 0) {
        // console.log(setOrigin(position.oldType, position.type));
        // element.value.style.transformOrigin = setOrigin(position.oldType, position.type)
    }
}

const origin = [
    'right bottom', 'bottom top', 'left bottom', 'left center',
    'left top', 'center top', 'right top', 'right center'
];
/**
 * @method setOrigin 设置锚点，用于指定方向增加
 * @param {number} oldType 原定旋转内容
 * @param {number} actionType 旋转点
 */
const setOrigin = (oldType: number, actionType: number) => {
    // return origin[actionType - 1];
    return 'left top'
}

/**
 * @method handleRotatePosition 处理旋转下的位置定位
 * @param {number} rotate 旋转角度
 * @param {number} actionType 动作
 */
const handleRotatePosition = (rotate: number, actionType: number) => {
    if (rotate > 337) {
        return actionType;
    }
    let returnAction = actionType;
    rotateType.forEach((v, i) => {
        if (rotate >= v.min && rotate < v.max) {
            returnAction += i;
        }
    })

    return returnAction > 8 ? (returnAction - 8) : returnAction;
}

/**
 * @method getCursorType 获取cursor的鼠标按钮
 * @param {number} rotate
 * @param {string} type
 */
const getCursorType = (rotate: number, type: string) => {
    let hRotate = rotate % 360;
    if (hRotate < 0) {
        hRotate += 360;
    }
    let actionType: any = Reflect.get(pointPositionType, type);
    actionType = handleRotatePosition(hRotate, actionType);

    return Reflect.get(cursorType, actionType);
}
/**
 * @method setResizeStyle 设置定位点的cursor标记
 * @param resizeElement 
 * @param child 
 * @param rotateData 
 * @param childType 
 * @param center 
 */
const setResizeStyle = (resizeElement: any, child: any, rotateData: any, childType: any, center: any) => {
    let { width, height } = child.value?.props?.info.style.layout
    let { x, y } = child.value?.props?.info.style.position
    let { rotate, scaleX, scaleY } = child.value?.props?.info.style.transform
    rotateData.value = rotate
    childType.value = child.value?.props?.info.type
    resizeElement.value.style.width = width
    resizeElement.value.style.height = height
    resizeElement.value.style.left = x
    resizeElement.value.style.top = y
    resizeElement.value.style.transform = `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`
    center.x = resizeElement.value.offsetLeft + resizeElement.value.offsetWidth / 2;
    center.y = resizeElement.value.offsetTop + resizeElement.value.offsetHeight / 2;
}

const updateCenter = (element: any, center: any) => {
    center.x = element.value.offsetLeft + element.value.offsetWidth / 2;
    center.y = element.value.offsetTop + element.value.offsetHeight / 2;
}
export {
    calculateChangeWidthAndHeight,
    changeLocation,
    handleRotatePosition,
    getCursorType,
    setResizeStyle,
    updateCenter
}