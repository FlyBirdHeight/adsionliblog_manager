import { ref, watch } from 'vue';
export default function useProjection(preRender: any, handleObj: any) {
    const projection = ref<boolean>(false)
    const projectionPage = (show: boolean) => {
        if (preRender.value) {
            if (show) {
                preRender.value.style.zIndex = 2000;
                preRender.value.style.backgroundColor = 'rgba(0, 0, 0, .75)';
            } else {
                preRender.value.style.zIndex = -50;
                preRender.value.style.backgroundColor = 'transparent';
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