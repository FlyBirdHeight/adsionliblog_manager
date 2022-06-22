import { DomOffset, ClickPosition } from './type'

const dragDom = (domOffset: DomOffset, clickPosition: ClickPosition) => {
    return (dragEvent: any) => {
        domOffset.x += dragEvent.pageX - clickPosition.x
        domOffset.y += dragEvent.pageY - clickPosition.y

        clickPosition.x = dragEvent.pageX
        clickPosition.y = dragEvent.pageY
    }
}

const onDrag = (document: Document, drag: any) => {
    const up = () => {
        console.log('up');
        
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', up)
}

export {
    dragDom,
    onDrag
}