import { DomAttribute, DomOffset, DomScale, ClickPosition, EventAttribute } from './type'
import { getPoint, getOppositePoint, getMovePoint, getSineCosine, getCenter } from './point';

/**

 * @method scale 放缩
 * @param domAttribute dom属性 
 * @param domOffset dom偏移 
 * @param domScale dom放缩
 * @param clickPosition 鼠标mousedown数据
 * @param eventAttribute 事件属性
 * @param scaleType 
 * @param scaleLimit 
 * @param updateFunc 
 */
const scale = (domAttribute: DomAttribute, domOffset: DomOffset, domScale: DomScale, clickPosition: ClickPosition, eventAttribute: EventAttribute, scaleType: number, scaleLimit: number, updateFunc: Function) => {
    const ratio = (domAttribute.width * domScale.x) / (domAttribute.height * domScale.y);
    let point = getPoint(domAttribute, domOffset, domScale, eventAttribute.scaleFromCenter, scaleType);
    let oppositePoint = getOppositePoint(domAttribute, domOffset, domScale, eventAttribute.scaleFromCenter, scaleType);
    const currentProps = {
        x: domOffset.x,
        y: domOffset.y,
        scaleX: domScale.x,
        scaleY: domScale.y
    }
    return (event: any) => {
        if (eventAttribute.enableScaleFromCenter && ((event.altKey && !eventAttribute.scaleFromCenter) || (!event.altKey && eventAttribute.scaleFromCenter))) {
            clickPosition.x = event.pageX;
            clickPosition.y = event.pageY;

            eventAttribute.scaleFromCenter = event.altKey && !eventAttribute.scaleFromCenter;
            point = getPoint(domAttribute, { x: currentProps.x, y: currentProps.y }, { x: currentProps.scaleX, y: currentProps.scaleY }, eventAttribute.scaleFromCenter, scaleType);
            oppositePoint = getOppositePoint(domAttribute, { x: currentProps.x, y: currentProps.y }, { x: currentProps.scaleX, y: currentProps.scaleY }, eventAttribute.scaleFromCenter, scaleType);
        }

        if (eventAttribute.aspectRatio && !event.shiftKey) {
            eventAttribute.aspectRatio = false;
        } else if (event.shiftKey && !eventAttribute.aspectRatio) {
            eventAttribute.aspectRatio = true;
        }
        if (!eventAttribute.enableAspectRatio) {
            eventAttribute.aspectRatio = false;
        }
        const moveDiff = {
            x: event.pageX - clickPosition.x,
            y: event.pageY - clickPosition.y
        }

        const movePoint = getMovePoint(moveDiff, point, oppositePoint, scaleType);
        if (eventAttribute.scaleFromCenter) {
            movePoint.x *= 2;
            movePoint.y *= 2;
        }
        const rotateFormula = getSineCosine(scaleType, domAttribute.angle || 0);

        const rotationPoint = {
            x: movePoint.x * rotateFormula.cos + movePoint.y * rotateFormula.sin,
            y: movePoint.y * rotateFormula.cos - movePoint.x * rotateFormula.sin
        }

        currentProps.scaleX = (rotationPoint.x / domAttribute.width) > scaleLimit ? rotationPoint.x / domAttribute.width : scaleLimit;
        currentProps.scaleY = (rotationPoint.y / domAttribute.height) > scaleLimit ? rotationPoint.y / domAttribute.height : scaleLimit;

        switch (scaleType) {
            case 8:
            case 4:
                currentProps.scaleY = domScale.y
                //等比变换的话，就需要把X变换的比例赋给Y
                if (eventAttribute.aspectRatio) {
                    currentProps.scaleY = ((domAttribute.width * currentProps.scaleX) * (1 / ratio)) / domAttribute.height;
                }
                break;
            case 2:
            case 6:
                currentProps.scaleX = domScale.x
                if (eventAttribute.aspectRatio) {
                    currentProps.scaleX = ((domAttribute.height * currentProps.scaleY) * ratio) / domAttribute.width;
                }
                break;
            default:
                if (eventAttribute.aspectRatio) {
                    currentProps.scaleY = ((domAttribute.width * currentProps.scaleX) * (1 / ratio)) / domAttribute.height;
                }
        }

        if (eventAttribute.enableScaleFromCenter && eventAttribute.scaleFromCenter) {
            const center = getCenter(domAttribute, domOffset, { x: currentProps.scaleX, y: currentProps.scaleY })
            currentProps.x = domOffset.x + (point.x - center.x)
            currentProps.y = domOffset.y + (point.y - center.y)
        } else {
            const freshOppositePoint = getOppositePoint(domAttribute, domOffset, { x: currentProps.scaleX, y: currentProps.scaleY }, eventAttribute.scaleFromCenter, scaleType);

            currentProps.x = domOffset.x + (oppositePoint.x - freshOppositePoint.x)
            currentProps.y = domOffset.y + (oppositePoint.y - freshOppositePoint.y)
        }

        updateFunc(currentProps)
    }
}

export {
    scale
}