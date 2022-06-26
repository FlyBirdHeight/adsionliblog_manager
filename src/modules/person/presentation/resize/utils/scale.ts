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
const scale = (
    props: {
        width: number,
        height: number,
        angle: number,
        x: number,
        y: number,
        scaleX: number,
        scaleY: number,
        startX: number,
        startY: number,
        scaleFromCenter: boolean,
        enableScaleFromCenter: boolean,
        aspectRatio: boolean,
        enableAspectRatio: boolean,
    },
    scaleType: string,
    scaleLimit: number,
    updateFunc: Function) => {
    let {
        width,
        height,
        angle,
        x,
        y,
        scaleX,
        scaleY,
        startX,
        startY,
        scaleFromCenter,
        enableScaleFromCenter,
        aspectRatio,
        enableAspectRatio
    } = props;
    const ratio = (width * scaleX) / (height * scaleY);

    let point = getPoint(scaleType, {
        x, y, scaleX, scaleY, width, height, angle, scaleFromCenter,
        center: null
    });

    let oppositePoint = getOppositePoint(scaleType, {
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        angle,
        center: null
    });

    const currentProps = {
        x: x,
        y: y,
        scaleX: scaleX,
        scaleY: scaleY
    }
    return (event: any) => {
        if (enableScaleFromCenter && ((event.altKey && !scaleFromCenter) || (!event.altKey && scaleFromCenter))) {
            startX = event.pageX;
            startY = event.pageY;

            scaleFromCenter = event.altKey && !scaleFromCenter;
            point = getPoint(scaleType, {
                ...currentProps,
                width,
                height,
                angle,
                scaleFromCenter,
                center: null
            });
            oppositePoint = getOppositePoint(scaleType, {
                ...currentProps,
                width,
                height,
                angle,
                center: null
            });
        }

        // if (aspectRatio && !event.shiftKey) {
        //     aspectRatio = false;
        // } else if (event.shiftKey && !aspectRatio) {
        //     aspectRatio = true;
        // }
        if (!enableAspectRatio) {
            aspectRatio = false;
        }
        const moveDiff = {
            x: event.pageX - startX,
            y: event.pageY - startY
        }

        const movePoint = getMovePoint(moveDiff, { x: point!.x, y: point!.y }, { x: oppositePoint!.x, y: oppositePoint!.y }, scaleType);
        if (enableScaleFromCenter && scaleFromCenter) {
            movePoint!.x *= 2;
            movePoint!.y *= 2;
        }
        const { cos, sin } = getSineCosine(scaleType, angle);

        const rotationPoint = {
            x: movePoint!.x * cos + movePoint!.y * sin,
            y: movePoint!.y * cos - movePoint!.x * sin
        }


        currentProps.scaleX = rotationPoint.x / width
        currentProps.scaleY = rotationPoint.y / height
        switch (scaleType) {
            case 'ml':
            case 'mr':
                currentProps.scaleY = scaleY
                //等比变换的话，就需要把X变换的比例赋给Y
                if (aspectRatio) {
                    currentProps.scaleY = ((width * currentProps.scaleX) * (1 / ratio)) / height;
                }
                break;
            case 'tm':
            case 'bm':
                currentProps.scaleX = scaleX
                if (aspectRatio) {
                    currentProps.scaleX = ((height * currentProps.scaleY) * ratio) / width;
                }
                break;
            default:
                if (aspectRatio) {
                    currentProps.scaleY = ((width * currentProps.scaleX) * (1 / ratio)) / height;
                }
        }

        if (enableScaleFromCenter && scaleFromCenter) {
            const center = getCenter(
                { width, height, angle },
                { x, y },
                { x: currentProps.scaleX, y: currentProps.scaleY }
            )
            currentProps.x = x + (point!.x - center.x)
            currentProps.y = y + (point!.y - center.y)
        } else {
            const freshOppositePoint = getOppositePoint(scaleType, {
                width,
                height,
                angle,
                x,
                y,
                scaleX: currentProps.scaleX,
                scaleY: currentProps.scaleY,
                center: null
            });

            currentProps.x = x + (oppositePoint!.x - freshOppositePoint!.x)
            currentProps.y = y + (oppositePoint!.y - freshOppositePoint!.y)
        }

        updateFunc(currentProps)
    }
}

export {
    scale
}