const addTextArea = function () {
    return {
        layout: {
            width: '200px',
            height: '100px',
            // left: '50%',
            // top: '50%',
            lineHeight: '14px',
            layer: 900
        },
        backgroundColor: "#EBEDF0",
        border: "none",
        color: "rgba(0,0,0,1)",
        font: {
            style: "",
            size: "14px",
            weight: "400",
            align: 'center'
        },
        animate: {
            join: {
                type: 'none',
                time: 0
            },
            left: {
                type: 'none',
                time: 0
            }
        },
        value: '添加文字',
    }
}

const analysisCss = function (textInfo: any) {
    let returnCss: any = {};
    returnCss.backgroundColor = textInfo.backgroundColor;
    returnCss.border = textInfo.border;
    returnCss.color = textInfo.color;
    returnCss.zIndex = textInfo.layout.layer;
    let { style: fontStyle, size: fontSize, weight: fontWeight, align: textAlign } = textInfo.font;
    returnCss = Object.assign({ fontStyle, fontSize, fontWeight, textAlign }, returnCss);
    let { width, height, left, top, lineHeight } = textInfo.layout;
    returnCss = Object.assign({ width, height, left, top, lineHeight }, returnCss);

    return returnCss;
}

export {
    addTextArea,
    analysisCss
}
