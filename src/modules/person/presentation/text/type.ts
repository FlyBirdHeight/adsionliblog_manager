import { ItemAnimate } from '../animation/type/animate'

type TextStyle = {
    attribute: {
        width: number,
        height: number,
        angle: number,
    },
    layer: number,
    scale: {
        x: number,
        y: number
    },
    backgroundColor: "transparent",
    border: {
        set: "none",
        color: "rgba(0,0,0,1)"
    },
    position: {
        x: number,
        y: number
    },
    color: "rgba(0,0,0,1)",
    font: {
        style: "normal",
        size: number,
        weight: "400",
        align: "center",
        family: "monospace"
    },
    text: {
        decoration: {
            line: "unset",
            style: "solid",
            color: "rgba(0,0,0,1)"
        }
    }
}

type TextItem = {
    style: TextStyle,
    index: string,
    data: string,
    type: "text",
    animate: ItemAnimate
}

export {
    TextStyle,
    TextItem
}