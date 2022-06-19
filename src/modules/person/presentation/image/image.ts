const imageInfo = () => {
    return {
        layout: {
            width: '200px',
            height: '200px'
        },
        position: {
            x: '30%',
            y: '30%'
        },
        transform: {
            rotate: 0,
            scaleX: 1,
            scaleY: 1
        },
        border: {
            line: 'none',
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
            invert: 0
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
        content: "drop_shadow",
    },
    {
        label: "颜色倒转",
        content: "invert"
    }
]

const addImage = (index: number, url: string) => {
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
            if (imgWidth > 1000 || imgHeight > 1000) {
                style.layout.width = imgWidth * 0.3 + 'px';
                style.layout.height = imgHeight * 0.3 + 'px';
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
    let { border, layout, style, transform, objectFit, objectPosition } = styleData;
    let returnCss: any = {};
    returnCss.border = border.line == 'none' ? 'none' : `${border.width} ${border.style}`;
    returnCss.borderColor = border.color;
    // returnCss.transform = `rotate(${transform.rotate}deg) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
    returnCss.filter = `contrast(${style.contrast}) opacity(${style.opacity}) blur(${style.blur}px) brightness(${style.brightness}) invert(${style.invert}) drop-shadow(${style.drop_shadow.x}px ${style.drop_shadow.x}px ${style.drop_shadow.radius}px ${style.drop_shadow.color})`
    returnCss.width = typeof (layout.width) == 'number' ? layout.width + 'px' : layout.width;
    returnCss.height = typeof (layout.height) == 'number' ? layout.height + 'px' : layout.height;
    returnCss.objectFit = objectFit;
    returnCss.objectPosition = `${objectPosition.x}% ${objectPosition.y}%`;

    return returnCss;
}

export {
    addImage,
    imageInfo,
    filterStyle,
    analysisCss
}