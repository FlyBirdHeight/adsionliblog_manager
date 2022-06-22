import { DomOffset, DomAttribute, DomScale } from './type';
import {
    transform, translate, scale, rotate, toCSS
} from "transformation-matrix"
/**
 * @method roundTo 4舍5入
 * @param n 
 * @param digits 
 */
const roundTo = (n: number, digits: number = 2) => {
    const multiplicator = Math.pow(10, digits)
    n = parseFloat((n * multiplicator).toFixed(11))
    const test = (Math.round(n) / multiplicator)
    return +(test.toFixed(2));
}

const styler = (domOffset: DomOffset, domAttribute: DomAttribute, domScale: DomScale, layer: number, disableScale: boolean = false) => {
    const changedWidth = domAttribute.width * (1 - domScale.x);
    const newWidth = domAttribute.width - changedWidth;
    const changedHeight = domAttribute.height * (1 - domScale.y);
    const newHeight = domAttribute.height - changedHeight;

    let transformMatrix;

    if (disableScale === false) {
        transformMatrix = transform(
            translate(roundTo(domOffset.x + changedWidth / 2), roundTo(domOffset.y + changedHeight / 2)),
            rotate((domAttribute.angle || 0) * (Math.PI / 180)),
            scale(domScale.x, domScale.y)
        );
    } else {
        transformMatrix = transform(
            translate(roundTo(domOffset.x + changedWidth), roundTo(domOffset.y + changedHeight)),
            rotate((domAttribute.angle || 0) * (Math.PI / 180)),
        );
        domAttribute.width = newWidth;
        domAttribute.height = newHeight;
    }

    return {
        element: {
            width: domAttribute.width,
            height: domAttribute.height,
            transform: toCSS(transformMatrix),
            position: "absolute",
            zIndex: layer
        },
        controls: {
            width: newWidth,
            height: newHeight,
            transform: toCSS(
                transform(
                    translate(roundTo(domOffset.x + changedWidth), roundTo(domOffset.y + changedHeight)),
                    rotate((domAttribute.angle || 0) * (Math.PI / 180)),
                )
            ),
            position: "absolute",
            zIndex: 'auto'
        }
    }
}

export default styler;