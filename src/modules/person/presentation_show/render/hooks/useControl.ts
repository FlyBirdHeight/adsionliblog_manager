import { ref, watch } from 'vue';
export default function useControl() {
    /**
     * @property {boolean} play 播放设置
     */
    const play = ref<boolean>(false);
    let timer: any = null;
    watch(play, (newV: boolean, oldV: boolean) => {
        console.log(newV)
        if (newV) {
            if (!timer) {
                timer = setTimeout(() => {
                    play.value = false;
                    clearTimeout(timer);
                }, 1000)
            }
        }
    })

    return play;
}