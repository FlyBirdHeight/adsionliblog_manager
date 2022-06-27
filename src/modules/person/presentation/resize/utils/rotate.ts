import { DomOffset, DomScale, DomAttribute, ClickPosition, ContainerOffset } from './type'
import { getCenter } from './point'

const rotate = (domOffset: DomOffset, domScale: DomScale, domAttribute: DomAttribute, clickPosition: ClickPosition, containerOffset: ContainerOffset, updatedFunc: Function) => {
    const domAttributeAngle = domAttribute.angle || 0;
    const center = getCenter(domAttribute, domOffset, domScale);
    const pressAngle = Math.atan2((clickPosition.y - containerOffset.y) - center.y, (clickPosition.x - containerOffset.x) - center.x) * 180 / Math.PI;

    return (event: any) => {
        const degree = Math.atan2((event.pageY - containerOffset.y) - center.y, (event.pageX - containerOffset.x) - center.x) * 180 / Math.PI;
        let ang = domAttributeAngle + degree - pressAngle;

        if (event.shiftKey) {
            ang = (ang / 15 >> 0) * 15;
        }
        if (ang < 0) {
            ang += 360
        } else if (ang > 360) {
            ang = ang > 360 ? ang % 360 : ang
        }
        updatedFunc({
            angle: ang
        })
    }
}

export {
    rotate
}