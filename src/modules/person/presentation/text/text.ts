const addTextArea = function (index: number) {
    return {
        layout: {
            width: '200px',
            height: '100px',
            lineHeight: '100px',
            layer: 900
        },
        backgroundColor: "transparent",
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
        data: '添加文字',
        index
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
    let { lineHeight } = textInfo.layout;
    returnCss = Object.assign({ lineHeight }, returnCss);

    return returnCss;
}

export {
    addTextArea,
    analysisCss
}
