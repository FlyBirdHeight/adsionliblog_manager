import { ref, watch } from 'vue';
export default function useControl(duration: number) {
    /**
     * @property {boolean} play 播放设置
     */
    const play = ref<boolean>(false);
    let timer: any = null;
    watch(play, (newV: boolean, oldV: boolean) => {
        if (newV) {
            if (!timer) {
                timer = setTimeout(() => {
                    play.value = false;
                    timer = null;
                }, duration)
            }
        }
    })

    return play;
}