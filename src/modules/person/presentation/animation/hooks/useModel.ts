import { getCurrentInstance, ref, watch } from 'vue';
export function useModel(props: any, key: string = 'modelValue', emit: any) {
    const vm = getCurrentInstance();
    const _emit = emit || vm?.emit;
    const event = `update:${key}`;
    const proxy = ref(props[key]);
    watch(
        () => proxy.value,
        (v: any) => _emit(event, v)
    );
    return proxy
}