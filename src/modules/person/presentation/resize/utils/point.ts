import { DomAttribute, DomOffset, DomScale, OppositePoint, Point, MoveDiff } from "./type"
/**
 * @method getCenter 获取中心点位置
 * @param domAttribute dom属性
 * @param domOffset dom偏移
 * @param domScale dom放缩
 */
const getCenter = (domAttribute: DomAttribute, domOffset: DomOffset, domScale: DomScale) => {
    const changeWidth = domAttribute.width * domScale.x;
    const changeHeight = domAttribute.height * domScale.y;

    const widthDiff = changeWidth - domAttribute.width;
    const heightDiff = changeHeight - domAttribute.height;

    return {
        x: domOffset.x - widthDiff + changeWidth / 2,
        y: domOffset.y - heightDiff + changeHeight / 2
    };
}
/**
 * @method getOriginalPositionFromScale 获取放缩变换后的点的位置
 * @param position 原有偏移量
 * @param size 原有数据大小
 * @param scale 放缩大小
 */
const getOriginalPositionFromScale = (position: number, size: number, scale: number) => {
    let changed = size * scale;

    let diff = changed - size;

    return position - diff;
}
/**
 * @method findPoint 寻找旋转之后的定位点位置
 * @param x x轴偏移量
 * @param y y轴偏移量
 * @param rotate 旋转角度
 * @param center 中心点坐标
 */
const findPoint = (x: number, y: number, rotate: number, center: { x: number, y: number }) => {
    const radian = rotate * (Math.PI / 180)
    return {
        x: (x - center.x) * Math.cos(radian) - (y - center.y) * Math.sin(radian) + center.x,
        y: (x - center.x) * Math.sin(radian) + (y - center.y) * Math.cos(radian) + center.y
    }
}

const getTL = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x, y, angle, center);
}

const getBL = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x, y + (height * scaleY), angle, center);
}

const getTR = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props

    return findPoint(x + (width * scaleX), y, angle, center);
}

const getBR = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x + (width * scaleX), y + (height * scaleY), angle, center);
}

const getMR = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x + (width * scaleX), y + (height * scaleY) / 2, angle, center);
}

const getBM = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x + (width * scaleX) / 2, y + (height * scaleY), angle, center);
}

const getTM = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x + (width * scaleX) / 2, y, angle, center);
}

const getML = (props: { x: number, y: number, scaleX: number, scaleY: number, width: number, height: number, angle: number, center: any }) => {
    let { x, y, scaleX, scaleY, width, height, angle, center } = props
    return findPoint(x, y + (height * scaleY) / 2, angle, center);
}

/**
 * @method getPoint 获取定位点坐标
 * @param scaleType 定位点类型 
 */
const getPoint = (scaleType: string, props: {
    x: number,
    y: number,
    angle: number,
    width: number,
    height: number,
    scaleX: number,
    scaleY: number,
    scaleFromCenter: boolean,
    center: any
}) => {
    //计算中心点
    const center = getCenter(
        { width: props.width, height: props.height, angle: props.angle },
        { x: props.x, y: props.y },
        { x: props.scaleX, y: props.scaleY }
    )
    //判断是否是通过中心进行放缩，如果是的话，直接返回中心点
    if (props.scaleFromCenter) {
        return center;
    }
    //这里的x,y是重新根据width和height以及是否有scale给出的计算缩放后的点的位置
    props = {
        ...props,
        x: getOriginalPositionFromScale(props.x, props.width, props.scaleX),
        y: getOriginalPositionFromScale(props.y, props.height, props.scaleY)
    }

    let caller = getTL;
    switch (scaleType) {
        case 'tl':
            caller = getTL
            break;
        case 'ml':
            caller = getML
            break;
        case 'tr':
            caller = getTR
            break;
        case 'tm':
            caller = getTM
            break;
        case 'bl':
            caller = getBL
            break;
        case 'bm':
            caller = getBM
            break;
        case 'br':
            caller = getBR
            break;
        case 'mr':
            caller = getMR
            break;
    }
    props.center = center;

    return caller(props)
}
/**
 * @method getOppositePoint 获取相反点坐标
 * @param scaleType 定位点类型 
 */
const getOppositePoint = (scaleType: string, props: {
    x: number,
    y: number,
    angle: number,
    width: number,
    height: number,
    scaleX: number,
    scaleY: number,
    center: any
}) => {
    let caller = getTL;
    const center = getCenter(
        { width: props.width, height: props.height, angle: props.angle },
        { x: props.x, y: props.y },
        { x: props.scaleX, y: props.scaleY }
    )

    props = {
        ...props,
        x: getOriginalPositionFromScale(props.x, props.width, props.scaleX),
        y: getOriginalPositionFromScale(props.y, props.height, props.scaleY)
    }
    switch (scaleType) {
        case 'tl':
            caller = getBR
            break

        case 'ml':
            caller = getMR
            break

        case 'tr':
            caller = getBL
            break

        case 'tm':
            caller = getBM
            break

        case 'bl':
            caller = getTR
            break

        case 'bm':
            caller = getTM
            break

        case 'br':
            caller = getTL
            break

        case 'mr':
            caller = getML
            break
    }
    props.center = center;
    return caller(props)
}

/**
 * @method getMovePoint 获取移动后的相对于远点定位点的坐标值
 * @param moveDiff 
 * @param point 
 * @param oppositePoint 
 * @param scaleType 
 */
const getMovePoint = (moveDiff: MoveDiff, point: Point, oppositePoint: OppositePoint, scaleType: string) => {
    switch (scaleType) {
        case 'tl':
            return {
                x: oppositePoint.x - (moveDiff.x + point.x),
                y: oppositePoint.y - (moveDiff.y + point.y)
            };
        case 'ml':
            return {
                x: oppositePoint.x - moveDiff.x - point.x,
                y: oppositePoint.y - moveDiff.y - point.y
            };
        case 'tr':
        case 'tm':
            return {
                x: point.x + (moveDiff.x - oppositePoint.x),
                y: oppositePoint.y - (moveDiff.y + point.y)
            };
        case 'mr':
        case 'br':
            return {
                x: point.x + (moveDiff.x - oppositePoint.x),
                y: point.y + (moveDiff.y - oppositePoint.y)
            };
        case 'bl':
        case 'bm':
            return {
                x: oppositePoint.x - (moveDiff.x + point.x),
                y: point.y + (moveDiff.y - oppositePoint.y)
            };
    }
}
/**
 * @method getSineCosine 获取正余弦表达式
 * @param scaleType 
 * @param angle 
 */
const getSineCosine = (scaleType: string, angle: number) => {
    switch (scaleType) {
        case 'tr':
        case 'tm':
        case 'bl':
        case 'bm':
            return {
                cos: Math.cos(-angle * (Math.PI / 180)),
                sin: Math.sin(-angle * (Math.PI / 180))
            }
        default:
            return {
                cos: Math.cos(angle * (Math.PI / 180)),
                sin: Math.sin(angle * (Math.PI / 180))
            }
    }
}

export {
    getCenter,
    getPoint,
    getOppositePoint,
    getMovePoint,
    getSineCosine
}