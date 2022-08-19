import { ref, watch, nextTick } from 'vue';
export default function useProjection(preRender: any, handleObj: any) {
    const projection = ref<boolean>(false)
    const projectionPage = (show: boolean) => {
        if (preRender.value) {
            if (show) {
                preRender.value.offsetParent.style.zIndex = handleObj.layerSetting.endLayer + 10;
                preRender.value.offsetParent.style.backgroundColor = 'rgba(0, 0, 0, .75)';
                preRender.value.style.zIndex = 0;
            } else {
                preRender.value.offsetParent.style.zIndex = -50;
                preRender.value.offsetParent.style.backgroundColor = 'transparent';
                preRender.value.style.zIndex = -50;
            }
        }
    }
    watch(projection, (newV: any, oldV: any) => {
        projectionPage(newV)
    }, {
        immediate: true
    })
    return projection
}