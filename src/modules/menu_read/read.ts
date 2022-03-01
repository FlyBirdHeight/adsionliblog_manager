import { RouteRecordRaw } from 'vue-router';
interface Menu {
    name: string;
    path?: string;
    routeName?: string;
    children?: Array<Menu>;
    component?: string;
}
interface MenuData {
    name: string;
    path?: string;
    icon?: string;
}
class GenerateRouter {
    menuData: Array<Menu> = require("@/data/menu.json").menu;
    routerData: Array<RouteRecordRaw>;
    showMenu: Array<MenuData>;
    constructor() {
        this.routerData = [];
        this.showMenu = [];
    }
    /**
     * @method handleRouteData 处理路由数据
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
}

export default GenerateRouter;