import { PageAnimate } from "../../type"
import { pageAnimate } from '../data/list';
import { reactive, ref } from 'vue';
import { WaitSetting } from '../components/utils/utils';
import { AnimateList } from '../type/animate';
import ImplementAnimate from '../implement';
const setPageAnimate = function (this: any, pageAnimate: PageAnimate) {
    if (pageAnimate.in.type !== '') {
        this.pageAnimate.in.type = pageAnimate.in.type;
        this.pageAnimate.in.time = pageAnimate.in.time || 1000;
    }
    if (pageAnimate.out.type !== '') {
        this.pageAnimate.out.type = pageAnimate.out.type;
        this.pageAnimate.out.time = pageAnimate.out.time || 1000
    }
}
const getAnimateIcon = (type: string) => {
    let index = pageAnimate.findIndex((v: { label: string, action: string, icon: string }) => {
        return v.action === type;
    })

    return pageAnimate[index].icon;
}
const setAnimateData = function (this: any, itemAnimate: any, item: any) {
    let animate = itemAnimate.animate;
    let data = reactive({
        itemIndex: itemAnimate.index,
        // icon: getAnimateIcon(animate.type),
        icon: '',
        mode: itemAnimate.mode,
        item: item.animate,
        action: {
            time: animate.time,
            action: animate.type,
            speed: animate.speed,
            trigger: animate.trigger,
            options: animate.info,
            order: animate.order
        }
    });
    let key = itemAnimate.index + '-' + itemAnimate.mode;
    if (animate.trigger == 'click') {
        this.activeTrigger.set(key, data)
    } else {
        this.autoImplementStack.set(key, data);
    }
    this.execuationOrder.set(animate!.order, data)
    this.showList.push(data);
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
            if (item.animate.in.type != '') {
                setAnimateData.call(this, { animate: item.animate.in, index: item.index, mode: 'in' }, item);
            }
            if (item.animate.out.type != '') {
                setAnimateData.call(this, { animate: item.animate.out, index: item.index, mode: 'out' }, item);
            }
        }
    }
    this.showList.length != 0 && this.showList.sort((a: any, b: any) => a.action.order - b.action.order);
}

const addAnimate = function (this: any, item: any, setting: WaitSetting, mode: string) {
    let order: number = this.execuationOrder.size;
    setting.order = order;
    let key = item.index + '-' + mode;
    if (this.activeTrigger.has(key)) {
        updateAnimate.call(this, this.activeTrigger.get(key), setting, key)
        return
    } else if (this.autoImplementStack.has(key)) {
        updateAnimate.call(this, this.autoImplementStack.get(key), setting, key);
        return;
    }
    setAnimateData.call(this, { animate: setting, index: item.index, mode }, item);
    if (item.animate.in.type !== '') {
        item.animate.show = false;
    } else {
        item.animate.show = true;
    }
}
const updateAnimate = function (this: ImplementAnimate, oldData: any, setting: WaitSetting, key: string) {
    if (oldData.action.trigger !== setting.trigger) {
        if (oldData.action.trigger === 'click') {
            this.activeTrigger.delete(key);
            this.autoImplementStack.set(key, oldData);
        } else {
            this.autoImplementStack.delete(key);
            this.activeTrigger.set(key, oldData);
        }
    }
    oldData.action = {
        time: setting.time,
        action: setting.type,
        speed: setting.speed,
        options: setting.info,
        order: setting.order,
        trigger: setting.trigger,
    }
}
const changeAnimateOrder = function (this: ImplementAnimate, oldOrder: number, newOrder: number) {
    let oldData: any = this.execuationOrder.get(oldOrder);
    let tar: any = this.execuationOrder.get(newOrder);
    oldData.action.order = newOrder;
    tar.action.order = oldOrder;
    this.execuationOrder.set(newOrder, oldData);
    this.execuationOrder.set(oldOrder, tar);
}
export {
    setPageAnimate,
    setItemAnimate,
    addAnimate,
    changeAnimateOrder
}