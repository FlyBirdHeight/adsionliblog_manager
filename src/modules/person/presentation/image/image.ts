const imageInfo = () => {
    return {
        attribute: {
            width: 200,
            height: 200,
            angle: 0,
        },
        layer: 900,
        position: {
            x: 200,
            y: 100
        },
        scale: {
            x: 1,
            y: 1
        },
        border: {
            line: 0,
            width: 1,
            style: "solid",
            radius: 0,
            color: "rgba(0,0,0,1)"
        },
        style: {
            opacity: 1,
            contrast: 1,
            brightness: 1,
            blur: 0,
            drop_shadow: {
                x: 2,
                y: 4,
                radius: 6,
                color: 'rgba(0, 0, 0, 1)'
            },
            invert: 0,
            setStyle: ["drop-shadow"]
        },
        event: {
            scaleFromCenter: false,
            enableScaleFromCenter: false,
            aspectRatio: true,
            enableAspectRatio: true
        },
        objectFit: "fill",
        objectPosition: {
            x: 0,
            y: 0
        },
        ratio: 1,
        natural: {
            height: 0,
            width: 0
        }
    }
}
type FilterStyleList = {
    label: string,
    content: string
}
const filterStyle: FilterStyleList[] = [
    {
        label: "模糊",
        content: "blur",
    },
    {
        label: "亮度",
        content: "brightness",
    },
    {
        label: "对比度",
        content: "contrast",
    },
    {
        label: "透明度",
        content: "opacity",
    },
    {
        label: "深度阴影",
        content: "drop-shadow",
    },
    {
        label: "颜色倒转",
        content: "invert"
    }
]
const decorationStyle = [
    {
        label: "直线",
        value: "solid"
    },
    {
        label: "点线",
        value: "dotted"
    },
    {
        label: "短划线",
        value: "dashed"
    }
]
const addImage = (index: number, url: string) => {
    const setSize = (width: number, height: number) => {
        while (width > 700 || height > 700) {
            width = width * 0.3;
            height = height * 0.3;
        }
        return {
            width, height
        };
    }
    return new Promise(resolve => {
        let image = new Image();
        image.src = url;
        let imgHeight = 0, imgWidth = 0;
        let ratio = 1;
        image.onload = function (e: any) {
            imgHeight = e.path[0].naturalHeight;
            imgWidth = e.path[0].naturalWidth;
            ratio = Number((imgWidth / imgHeight).toFixed(3));
            let style = imageInfo();
            style.natural.width = imgWidth;
            style.natural.height = imgHeight;
            if (imgWidth > 700 || imgHeight > 700) {
                ({ width: style.attribute.width, height: style.attribute.height } = setSize(imgWidth, imgHeight))
            }

            style.ratio = ratio;
            resolve({
                style,
                url,
                index: index,
                ratio: true,
                type: "image"
            })
        }
    })
}

const analysisCss = (styleData: any, url: string) => {
    let { border, attribute, style, scale, objectFit, objectPosition, layer } = styleData;
    let returnCss: any = {};
    returnCss.border = !Boolean(border.line) ? 'none' : `${border.width}px ${border.style}`;
    returnCss.borderColor = border.color;
    returnCss.borderRadius = border.radius + '%'
    returnCss.zIndex = layer;
    returnCss.filter = "";
    style.setStyle.forEach((v: string) => {
        if (v === 'drop-shadow') {
            returnCss.filter += `${v}(${style.drop_shadow.x}px ${style.drop_shadow.y}px ${style.drop_shadow.radius}px ${style.drop_shadow.color}) `
        } else if (v === 'blur') {
            returnCss.filter += `${v}(${style.blur}px)`
        } else {
            returnCss.filter += `${v}(${style[v]})`
        }
    })

    returnCss.width = typeof (attribute.width) == 'number' ? attribute.width + 'px' : attribute.width;
    returnCss.height = typeof (attribute.height) == 'number' ? attribute.height + 'px' : attribute.height;
    returnCss.objectFit = objectFit;
    returnCss.objectPosition = `${objectPosition.x}% ${objectPosition.y}%`;

    return returnCss;
}

export {
    addImage,
    imageInfo,
    filterStyle,
    analysisCss,
    decorationStyle
}