import { RouteRecordRaw } from 'vue-router';
interface Menu {
    name: string;
    path?: string;
    routeName?: string;
    children?: Array<Menu>;
    component?: string;
    icon?: string;
}
interface MenuData {
    name: string;
    index: string;
    isGroup: boolean;
    path?: string;
    icon?: string;
    children?: Array<MenuData>;
}
class GenerateMenuData {
    menuData: Array<Menu> = require("@/data/menu.json").menu;
    routerData: Array<RouteRecordRaw>;
    showMenu: Array<MenuData>;
    constructor() {
        this.routerData = [];
        this.showMenu = [];
    }
    /**
     * @method handleRouteData 处理路由数据
     * @param {Array[Menu]} data menu未处理数据
     * @param {string} parent 父类路径
     * @return {Array<RouteRecordRaw>}
     */
    handleRouteData(data: Array<Menu> | undefined, parent: string = ''): Array<RouteRecordRaw> {
        if (!data) {
            return [];
        }
        let res: Array<RouteRecordRaw> = [];
        for (let value of data) {
            let hasPath: boolean = Reflect.has(value, 'path');
            if (hasPath) {
                let path: string = parent == '' ? `/${value.path}` : `${value.path}`
                let name: string = `${value.routeName}`;
                let component: any = parent == '' ?
                    Reflect.has(value, 'component') ? () => import(`@/${value.component}.vue`) : () => import(`@/views/index.vue`)
                    : () => import(`@/${value.component}.vue`)
                let children: Array<RouteRecordRaw> = [];
                if (Reflect.has(value, 'children')) {
                    children = this.handleRouteData(value.children, value.path);
                }
                let router: RouteRecordRaw = {
                    name: name,
                    path: path,
                    component: component,
                    children: children,
                    redirect: children.length != 0 ? `${parent}/${value.path}/${children[0].path}` : ''
                };
                if (children.length == 0) {
                    Reflect.deleteProperty(router, 'children')
                    Reflect.deleteProperty(router, 'redirect')
                }
                res.push(router);
            } else {
                if (Reflect.has(value, 'children')) {
                    res = res.concat(this.handleRouteData(value.children, parent))
                }
            }

        }

        return res;
    }

    /**
     * @method handleMenuData 处理列表数据
     * @param {Array[Menu]} data menu未处理数据
     * @param {string} parentPath 父类路径
     * @param {string} parentIndex 父类编号
     * @return {Array[MenuData]}
     */
    handleMenuData(data: Array<Menu> | undefined, parentPath: string = '', parentIndex: string = '0'): Array<MenuData> {
        if (!data) {
            return [];
        }
        let res: Array<MenuData> = [];
        let idx: number = 0;
        for (let value of data) {
            let isGroup = !Reflect.has(value, 'path');
            let hasChildren = Reflect.has(value, 'children');
            let innerData: MenuData = {
                name: value.name,
                index: parentIndex == '0' ? (++idx).toString() : (parentIndex + '-' + (++idx)),
                isGroup,
                icon: value.icon
            }
            if (hasChildren) {
                !isGroup && (innerData.path = parentPath == '' ? `/${value.path}` : parentPath + '/' + value.path)
                innerData.children = this.handleMenuData(value.children, isGroup ? parentPath : innerData.path, isGroup ? parentIndex : innerData.index);
            } else {
                !isGroup && (innerData.path = parentPath == '' ? `/${value.path}` : parentPath + '/' + value.path)
            }
            res.push(innerData)
        }
        return res;
    }

    /**
     * @method findMenuIndex 寻找列表数据匹配的routePath的值，并返回index
     * @param {Array<MenuData>} data menuList值
     * @param {string} path 路由路径
     */
    findMenuIndex(data: Array<MenuData>, path: string): any {
        for (let v of data) {
            if (Reflect.has(v, 'path')) {
                if (path == v.path) {
                    return v.index;
                }
            }
            if (Reflect.has(v, 'children') && Reflect.get(v, 'children').length != 0) {
                let returnData = this.findMenuIndex(Reflect.get(v, 'children'), path);
                if (returnData != '') {
                    return returnData;
                }
            }
        }
        return '';
    }
}

export default GenerateMenuData;