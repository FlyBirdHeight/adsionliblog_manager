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
    },
    animate: {
        join: {
            type: "none",
            time: number
        },
        left: {
            type: "none",
            time: number
        }
    }
}

type TextItem = {
    style: TextStyle,
    index: string,
    data: string,
    type: "text"
}

export {
    TextStyle,
    TextItem
}