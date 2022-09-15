import { ImageStyle, ImageItem } from './type';
import { localImage } from '../utils/utils';
const imageInfo = (): ImageStyle => {
    return {
        attribute: {
            width: 200,
            height: 200,
            angle: 0,
        },
        layer: 1000,
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

const addImage = function (this: any, url: string): Promise<ImageItem> {
    const setSize = (width: number, height: number) => {
        while (width > 700 || height > 700) {
            width = width * 0.3;
            height = height * 0.3;
        }
        return {
            width, height
        };
    }
    const index = this.guid();
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status === 200) {
                let blob = this.response;
                let localUrl = URL.createObjectURL(blob)
                let image = new Image();
                image.src = localUrl;
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
                        localUrl,
                        index: index,
                        ratio: true,
                        type: "image",
                        animate: {
                            in: {
                                type: '',
                                time: 1000,
                                trigger: '',
                                info: null,
                                speed: 1,
                            },
                            out: {
                                type: '',
                                time: 1000,
                                trigger: '',
                                info: null,
                                speed: 1,
                            },
                            show: true
                        }
                    })
                }
            }
        }
        xhr.send()
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

const convertImageData = async (imageData: any) => {
    let style = imageData.config;
    let url = imageData.url;
    let index = imageData.item_index;
    let type = imageData.type;
    let localUrl = await localImage(url);
    return {
        style,
        url,
        index,
        ratio: true,
        localUrl,
        type
    }
}

export {
    addImage,
    imageInfo,
    filterStyle,
    analysisCss,
    decorationStyle,
    convertImageData
}