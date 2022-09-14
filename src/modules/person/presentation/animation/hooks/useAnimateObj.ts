import { inject } from 'vue';
export default function useAnimateObj() {
    const handleObj: any = inject('handleObj');
    const animateObj = handleObj.implementAnimate;

    return animateObj;
}