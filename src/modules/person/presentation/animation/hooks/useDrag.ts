import { ref, watch } from 'vue';

export default function useDrag(func: Function | null) {
    const dragEnterData = ref<any>(null)
    const dragInfo = ref<any>(null)
    const dragDom = ref<any>(null)

    const dragStart = (event: any, column: any) => {
        dragInfo.value = column
        dragDom.value = event.path[0]
        dragDom.value && (dragDom.value!.style!.opacity = 0)
    }
    const dragEnter = (event: any, column: any) => {
        dragEnterData.value = column
    }
    const dragOver = (event: any, column: any) => {
        event.preventDefault()
    }
    const dragEnd = (event: any) => {
        dragDom.value && (dragDom.value!.style!.opacity = 1)
        dragDom.value = null
    }
    const dragDrop = (event: any) => {
        if (event.stopPropagation) {
            event.stopPropagation()
        }
        dragEnterData.value = null
        dragInfo.value = null
    }

    watch(dragEnterData, (newV: any, oldV: any) => {
        if (!func) {
            return;
        }
        console.log(new Object({ dragInfo: dragInfo.value, dragEnterData, dragDom }))
        func.call(new Object({ dragInfo: dragInfo.value, dragEnterData, dragDom }), newV, oldV)
    })

    return {
        dragStart,
        dragEnter,
        dragOver,
        dragEnd,
        dragDrop
    }
}