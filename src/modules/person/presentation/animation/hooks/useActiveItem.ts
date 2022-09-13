import { inject, watch, ref } from 'vue';
export default function useActiveItem(func: Function | null = null) {
    const activeIndex: any = inject('activeItem');

    const itemIndex: any = inject('itemTypeIndexList');
    const handleObj: any = inject('handleObj')
    const itemData = ref(null);
    watch(activeIndex, (newV: any) => {
        if (newV != -1) {
            let typeIndex: number = itemIndex.value.findIndex((v: { index: string, type: string }) => {
                return v.index === newV;
            });
            let type = itemIndex.value[typeIndex].type;
            let itemList: any[] = handleObj.currentPageData.item[type];
            let index = itemList.findIndex((v: any) => {
                return v.index === newV
            })
            if (func) {
                itemData.value = func.call(null, itemList[index]);
            } else {
                itemData.value = itemList[index];
            }
        } else if (newV === -1) {
            itemData.value = null;
        }
    })

    return itemData;
}