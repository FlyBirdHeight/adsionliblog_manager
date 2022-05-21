import { useStore, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
import { computed } from 'vue';
/**
 * @method useMapper 为vuex中的module来绑定上下文context，使其可以在vue3中被使用
 * @param {*} mapper 用来承载需要的内容的
 * @param {Function} mapperFn 用来调用的map方法
 * @param {string} type 类型
 */
const useMapper = (mapper: any, mapperFn: Function, type: string) => {
    const store = useStore();
    const storeStateFns = mapperFn(mapper);
    const storeState: any = {};
    Object.keys(storeStateFns).forEach(fnKey => {
        // vuex源码中mapState和mapGetters的方法中使用的是this.$store,所以更改this绑定
        const fn = storeStateFns[fnKey].bind({ $store: store });
        if (type === 'state') {
            storeState[fnKey] = computed(fn)
        }
    })

    return storeState
}

/**
 * @method useState 相当于mapState
 * @param {string} moduleName 模块名称
 * @param mapper namespace以及相关需要使用的属性 
 */
const useState = (moduleName: string, mapper: any) => {
    let mapFn = mapState;
    if (Object.prototype.toString.call(moduleName) === "[object String]" && moduleName.length > 0) {
        mapFn = createNamespacedHelpers(moduleName).mapState
    }

    return useMapper(mapper, mapFn, 'state');
}
/**
 * @method useMutation 相当于mapMutation
 * @param {string} moduleName 模块名称
 * @param mapper namespace以及相关需要使用的属性 
 */
const useMutation = (moduleName: string, mapper: any) => {
    let mapFn = mapMutations;
    if (Object.prototype.toString.call(moduleName) === "[object String]" && moduleName.length > 0) {
        mapFn = createNamespacedHelpers(moduleName).mapMutations
    }

    return useMapper(mapper, mapFn, 'mutation');
}
/**
 * @method useGetter 相当于mapGetters
 * @param {string} moduleName 模块名称
 * @param mapper namespace以及相关需要使用的属性 
 */
const useGetter = (moduleName: string, mapper: any) => {
    let mapFn = mapGetters;
    if (Object.prototype.toString.call(moduleName) === "[object String]" && moduleName.length > 0) {
        mapFn = createNamespacedHelpers(moduleName).mapGetters
    }

    return useMapper(mapper, mapFn, 'getter');
}
/**
 * @method useAction 相当于mapMutation
 * @param {string} moduleName 模块名称
 * @param mapper namespace以及相关需要使用的属性 
 */
const useAction = (moduleName: string, mapper: any) => {
    let mapFn = mapActions;
    if (Object.prototype.toString.call(moduleName) === "[object String]" && moduleName.length > 0) {
        mapFn = createNamespacedHelpers(moduleName).mapActions
    }

    return useMapper(mapper, mapFn, 'action');
}

export {
    useState,
    useMutation,
    useGetter,
    useAction
}