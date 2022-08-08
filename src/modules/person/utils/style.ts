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

const getPositionStyle = (scale: { x: number, y: number }, attribute: { width: number, height: number, angle: number }, offset: { x: number, y: number }) => {
    const changedWidth: number = attribute.width * (1 - scale.x);
    const newWidth: number = attribute.width - changedWidth;
    const changedHeight: number = attribute.height * (1 - scale.y);
    const newHeight: number = attribute.height - changedHeight;

    let width: string = newWidth + 'px';
    let height: string = newHeight + 'px';

    let transformMatrix: any = transform(
        translate(roundTo(offset.x + changedWidth), roundTo(offset.y + changedHeight)),
        rotate((attribute.angle || 0) * (Math.PI / 180)),
    )

    return {
        width,
        height,
        transform: toCSS(transformMatrix)
    }
}


export default getPositionStyle;