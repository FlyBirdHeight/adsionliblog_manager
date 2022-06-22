import { getCenter } from './point'
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
const generateData = () => {
    return {
        offset: {
            x: 0,
            y: 0
        },
        attribute: {
            width: 0,
            height: 0,
            angle: 0
        },
        scale: {
            x: 1,
            y: 1
        },
        containerOffset: {
            x: 0,
            y: 0
        },
        event: {
            scaleFromCenter: false,
            enableScaleFromCenter: false,
            aspectRatio: false,
            enableAspectRatio: false
        },
        layer: 900,
        disableScale: false
    }
}
const setResizeStyle = (child: any, childType: any, resizeData: any, containerLayout: DOMRect) => {
    let childStyle = child.value?.props?.info.style;
    let type = child.value?.props?.info.type;
    resizeData.offset = childStyle.position;
    resizeData.attribute = childStyle.attribute;
    resizeData.offset = childStyle.position;
    resizeData.layer = childStyle.layer;
    resizeData.containerOffset = { x: containerLayout.left, y: containerLayout.top }
    childType.value = type;
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

export {
    setResizeStyle,
    getCursorType,
    generateData
}