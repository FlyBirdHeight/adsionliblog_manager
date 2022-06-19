const calcRotate = (offsetX: number, offsetY: number, center: { x: number, y: number }, pageX: number, pageY: number) => {
    let x = (pageX - offsetX) - center.x;
    let y = (pageY - offsetY) - center.y;

    let ang = Math.atan2(y, x) * 180 / Math.PI;

    return ang;
}



export {
    calcRotate
}