import { ref, watch } from 'vue';
export default function useFullScreenTeleport(handleObj: any, parentId: string, instance: any) {
    const teleport = ref<boolean>(false);
    const findParent = function (): boolean {
        const dfs = (node: any): boolean => {
            if (!node) {
                return false;
            }
            if (node.ctx.$el.className == parentId) {
                return true;
            }

            return dfs(node.parent);
        }

        return dfs(instance);
    }
    watch(
        () => handleObj.fullscreen.fullStatus,
        (newV: boolean, oldV: boolean) => {
            if (newV) {
                teleport.value = findParent();
            }
        }
    )

    return teleport;
}