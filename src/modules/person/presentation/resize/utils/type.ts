type DomOffset = {
    x: number,
    y: number
}

type Point = DomOffset;
type OppositePoint = Point;
type MoveDiff = Point;

type DomAttribute = {
    width: number,
    height: number,
    angle?: number
}

type DomScale = {
    x: number,
    y: number
}

type ClickPosition = {
    x: number,
    y: number
}

type ContainerOffset = {
    x: number,
    y: number
}

type EventAttribute = {
    scaleFromCenter: boolean,
    enableScaleFromCenter: boolean,
    aspectRatio: boolean,
    enableAspectRatio: boolean
}

export {
    DomOffset,
    DomAttribute,
    DomScale,
    ClickPosition,
    ContainerOffset,
    EventAttribute,
    Point,
    OppositePoint,
    MoveDiff
}