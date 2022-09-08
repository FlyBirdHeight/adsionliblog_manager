import { PageAnimate } from "../../type"
import { pageAnimate } from '../data/list';
const setPageAnimate = function (this: any, pageAnimate: PageAnimate) {
    console.log('page',pageAnimate)
    // if (pageAnimate.in.type !== '') {
    //     this.pageAnimate.in.type = pageAnimate.in.type;
    //     this.pageAnimate.in.time = pageAnimate.in.time || 1000;
    // }
    // if (pageAnimate.out.type !== '') {
    //     this.pageAnimate.out.type = pageAnimate.out.type;
    //     this.pageAnimate.out.time = pageAnimate.out.time || 1000
    // }
}
const getAnimateIcon = (type: string) => {
    let index = pageAnimate.findIndex((v: { label: string, action: string, icon: string }) => {
        return v.action === type;
    })

    return pageAnimate[index].icon;
}
const setAnimateData = function (this: any, itemAnimate: any) {
    let animate = itemAnimate.animate;
    let data = {
        itemIndex: itemAnimate.index,
        type: animate.type,
        icon: getAnimateIcon(animate.type),
        mode: itemAnimate.mode,
        action: {
            time: animate.time,
            action: animate.type,
            options: animate.info || null
        }
    };
    if (animate.trigger === 'click') {
        this.activeTrigger.set(itemAnimate.index, data)
    } else {
        this.autoImplementStack.set(itemAnimate.index, data);
    }
    this.execuationOrder.set(animate!.order, data)
}
const setItemAnimate = function (this: any, items: any) {
    if (items.count == 0) {
        return
    }
    for (let key of Reflect.ownKeys(items)) {
        if (key === 'count') {
            continue;
        }
        if (items[key].length === 0) {
            continue
        }
        for (let item of items[key]) {
            console.log('item',item)
            // if (item.animate.in.type != '') {
            //     setAnimateData.call(this, { animate: item.animate.in, index: item.index, mode: 'in' });
            // }
            // if (item.animate.out.type != '') {
            //     setAnimateData.call(this, { animate: item.animate.out, index: item.index, mode: 'in' });
            // }
        }
    }
    // console.log(this.autoImplementStack);
    // console.log(this.activeTrigger);
    // console.log(this.showList);
    // console.log(this.execuatedStack);
    // console.log(this.pageAnimate)
}

export {
    setPageAnimate,
    setItemAnimate
}