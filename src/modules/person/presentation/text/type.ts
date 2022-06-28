type TextStyle = {
    attribute: {
        width: 200,
        height: 100,
        angle: 0,
    },
    layer: 900,
    scale: {
        x: 1,
        y: 1
    },
    backgroundColor: "transparent",
    border: {
        set: "none",
        color: "rgba(0,0,0,1)"
    },
    position: {
        x: 200,
        y: 100
    },
    color: "rgba(0,0,0,1)",
    font: {
        style: "normal",
        size: 22,
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
            time: 0
        },
        left: {
            type: "none",
            time: 0
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