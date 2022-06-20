import { DomAttribute, DomOffset, DomScale, OppositePoint, Point, MoveDiff } from "./type"
/**
 * @method getCenter 获取中心点位置
 * @param domAttribute dom属性
 * @param domOffset dom偏移
 * @param domScale dom放缩
 */
const getCenter = (domAttribute: DomAttribute, domOffset: DomOffset, domScale: DomScale) => {
    const center = {
        x: 0,
        y: 0
    }
    const changeWidth = domAttribute.width * domScale.x;
    const changeHeight = domAttribute.height * domScale.y;

    const widthDiff = changeWidth - domAttribute.width;
    const heightDiff = changeHeight - domAttribute.height;
    center.x = domOffset.x - widthDiff + changeWidth / 2;
    center.y = domOffset.y - heightDiff + changeHeight / 2;

    return center;
}
/**
 * @method getOriginalPositionFromScale 获取放缩变换后的点的位置
 * @param offset 原有偏移量
 * @param value 原有数据大小
 * @param scale 放缩大小
 */
const getOriginalPositionFromScale = (offset: number, value: number, scale: number) => {
    return offset - (value * scale - value);
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
        y: (x - center.x) * Math.cos(radian) + (y - center.y) * Math.sin(radian) + center.y
    }
}
/**
 * @method getPoint 获取定位点坐标
 * @param domAttribute dom属性
 * @param domOffset dom偏移
 * @param domScale dom放缩
 * @param scaleFromCenter 是否中心放缩
 * @param scaleType 定位点类型 
 */
const getPoint = (domAttribute: DomAttribute, domOffset: DomOffset, domScale: DomScale, scaleFromCenter: boolean, scaleType: number) => {
    const center = getCenter(domAttribute, domOffset, domScale);
    if (scaleFromCenter) {
        return center;
    }
    const pointInfo = {
        angle: domAttribute.angle || 0,
        domOffset,
        domScale,
        x: getOriginalPositionFromScale(domOffset.x, domAttribute.width, domScale.x),
        y: getOriginalPositionFromScale(domOffset.y, domAttribute.height, domScale.y)
    }
    const nCenter = getCenter(domAttribute, { x: pointInfo.x, y: pointInfo.y }, domScale)
    switch (scaleType) {
        case 1:
            break;
        case 2:
            pointInfo.x = pointInfo.x + (domAttribute.width * domScale.x) / 2
            break;
        case 3:
            pointInfo.x = pointInfo.x + (domAttribute.width * domScale.x)
            break;
        case 4:
            pointInfo.x = pointInfo.x + (domAttribute.width * domScale.x)
            pointInfo.y = pointInfo.y + (domAttribute.height * domScale.y) / 2
            break;
        case 5:
            pointInfo.x = pointInfo.x + (domAttribute.width * domScale.x)
            pointInfo.y = pointInfo.y + (domAttribute.height * domScale.y)
            break;
        case 6:
            pointInfo.x = pointInfo.x + (domAttribute.width * domScale.x) / 2
            pointInfo.y = pointInfo.y + (domAttribute.height * domScale.y)
            break;
        case 7:
            pointInfo.y = pointInfo.y + (domAttribute.height * domScale.y)
            break;
        case 8:
            pointInfo.y = pointInfo.y + (domAttribute.height * domScale.y) / 2
            break;
    }

    return findPoint(pointInfo.x, pointInfo.y, pointInfo.angle || 0, nCenter);
}
/**
 * @method getOppositePoint 获取相反点坐标
 * @param domAttribute dom属性
 * @param domOffset dom偏移
 * @param domScale dom放缩
 * @param scaleFromCenter 是否中心放缩
 * @param scaleType 定位点类型 
 */
const getOppositePoint = (domAttribute: DomAttribute, domOffset: DomOffset, domScale: DomScale, scaleFromCenter: boolean, scaleType: number) => {
    const oppositeType = (scaleType + 4) > 8 ? (scaleType + 4 - 8) : (scaleType + 4);

    return getPoint(domAttribute, domOffset, domScale, scaleFromCenter, oppositeType);
}

/**
 * @method getMovePoint 获取移动后的相对于远点定位点的坐标值
 * @param moveDiff 
 * @param point 
 * @param oppositePoint 
 * @param scaleType 
 */
const getMovePoint = (moveDiff: MoveDiff, point: Point, oppositePoint: OppositePoint, scaleType: number) => {
    const movePoint = {
        x: 0,
        y: 0
    }
    switch (scaleType) {
        case 1:
        case 8:
            movePoint.x = oppositePoint.x - moveDiff.x - point.x;
            movePoint.y = oppositePoint.y - moveDiff.y - point.y;
            break;
        case 2:
        case 3:
            movePoint.x = point.x + moveDiff.x - oppositePoint.x;
            movePoint.y = oppositePoint.y - moveDiff.y - point.y;
            break;
        case 4:
        case 5:
            movePoint.x = point.x + moveDiff.x - oppositePoint.x;
            movePoint.y = point.y + moveDiff.y - oppositePoint.y;
            break;
        case 6:
        case 7:
            movePoint.x = oppositePoint.x - moveDiff.x - point.x;
            movePoint.y = point.y + moveDiff.y - oppositePoint.y;
            break;
    }

    return movePoint;
}
/**
 * @method getSineCosine 获取正余弦表达式
 * @param scaleType 
 * @param angle 
 */
const getSineCosine = (scaleType: number, angle: number) => {
    switch (scaleType) {
        case 2:
        case 3:
        case 6:
        case 7:
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