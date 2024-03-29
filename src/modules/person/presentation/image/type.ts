import { ItemAnimate } from '../animation/type/animate'

type ImageStyle = {
    attribute: {
        width: number | string,
        height: number | string,
        angle: number
    },
    position: {
        x: number,
        y: number
    },
    scale: {
        x: number,
        y: number
    },
    layer: number,
    border: {
        line: number,
        width: number,
        style: string,
        radius: number,
        color: string
    },
    style: {
        opacity: number,
        contrast: number,
        brightness: number,
        blur: number,
        drop_shadow: {
            x: number,
            y: number,
            radius: number,
            color: string
        },
        invert: number,
        setStyle: string[]
    },
    event: {
        scaleFromCenter: false,
        enableScaleFromCenter: false,
        aspectRatio: true,
        enableAspectRatio: true
    },
    objectFit: string,
    objectPosition: {
        x: number,
        y: number
    },
    ratio: number,
    natural: {
        height: number,
        width: number
    }
}
type ImageItem = {
    style: ImageStyle,
    animate: ItemAnimate,
    index: string,
    url: string,
    ratio: true,
    localUrl?: string,
    type: "image"
}

export { ImageStyle, ImageItem }