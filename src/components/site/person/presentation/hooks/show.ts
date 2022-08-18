import { ref, watch } from 'vue';
export default function useProjection(preRender: any) {
    const projection = ref<boolean>(false)
    const projectionPage = (show: boolean) => {
        if (show) {
            preRender.value.style.zIndex = 500;
        } else {
            preRender.value.style.zIndex = -500;
        }
    }
    watch(projection, (newV: boolean, oldV: boolean) => {
        projectionPage(newV)
    })
    return projection
}