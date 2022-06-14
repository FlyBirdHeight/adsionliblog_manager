const defaultStyle = {
    layout: {
        width: "200px",
        height: "100px",
        layer: 900
    },
    backgroundColor: "transparent",
    border: "none",
    color: "rgba(0,0,0,1)",
    font: {
        style: "normal",
        size: "22px",
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

const fontFamilyList = [
    {
        label: "字体1",
        family: `monospace`,
    },
    {
        label: "字体2",
        family: `"Arial","Microsoft YaHei","黑体","宋体",sans-serif`,
    },
    {
        label: "字体3",
        family: `Tahoma,Helvetica,Arial,"宋体",sans-serif`,
    },
    {
        label: "字体4",
        family: `Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑", Arial, sans-serif`,
    },
    {
        label: "字体5",
        family: `-apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei","Microsoft Yahei",sans-serif`,
    },
    {
        label: "字体6",
        family: `"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;`
    },
    {
        label: "Monaco",
        family: `Monaco`
    },
    {
        label: "Apple Chancery",
        family: `Apple Chancery`
    },
    {
        label: "Brush Script MT",
        family: `Brush Script MT`
    },
    {
        label: "Chalkduster",
        family: `Chalkduster`
    }
]

const addTextArea = function (index: number) {
    return {
        style: {
            layout: {
                width: "200px",
                height: "100px",
                layer: 900
            },
            backgroundColor: "transparent",
            border: "none",
            color: "rgba(0,0,0,1)",
            font: {
                style: "normal",
                size: "22px",
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
        },
        data: "添加文字",
        index
    }
}

const analysisCss = function (textInfo: any) {
    let returnCss: any = {};
    returnCss.backgroundColor = textInfo.backgroundColor;
    returnCss.border = textInfo.border;
    returnCss.color = textInfo.color;
    returnCss.zIndex = textInfo.layout.layer;
    let { style: fontStyle, size: fontSize, weight: fontWeight, align: textAlign, family: fontFamily } = textInfo.font;
    returnCss = Object.assign({ fontStyle, fontSize, fontWeight, textAlign, fontFamily }, returnCss);
    let { line: textDecorationLine, style: textDecorationStyle, color: textDecorationColor } = textInfo.text.decoration;
    returnCss = Object.assign({ textDecorationLine, textDecorationStyle, textDecorationColor }, returnCss);

    return returnCss;
}

export {
    addTextArea,
    analysisCss,
    defaultStyle,
    fontFamilyList
}
