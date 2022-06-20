import { DomOffset, DomScale, DomAttribute, ClickPosition, ContainerOffset } from './type'
import { getCenter } from './point'

const rotate = (domOffset: DomOffset, domScale: DomScale, domAttribute: DomAttribute, clickPosition: ClickPosition, containerOffset: ContainerOffset, updatedFunc: Function) => {
    const center = getCenter(domAttribute, domOffset, domScale);
    const pressAngle = Math.atan2((clickPosition.x - containerOffset.x), (clickPosition.y - containerOffset.y)) * 180 / Math.PI;

    return (event: any) => {
        const degree = Math.atan2((event.pageY - containerOffset.y) - center.y, (event.pageX - containerOffset.x) - center.x) * 180 / Math.PI;
        let ang = (domAttribute.angle || 0) + degree - pressAngle;

        if (event.shift) {
            ang = (ang / 15 >> 0) * 15;
        }

        updatedFunc({
            angel: ang
        })
    }
}

export {
    rotate
}