import { getDirectoryList, MenuDataList, changeFileInfoToMenuData, changeDirectoryInfoToMenuData } from './arrange'
import axios from 'axios';
import { getInfo } from '@/modules/files/utils';
const preFilePath: string = "/file/link";
enum HandleFile {
    "UPLOAD_FILE" = "upload",
    "DOWNLOAD_FILE" = "download",
    "DELETE_FILE" = "delete",
    "SEE_INFO" = "info",
    "CREATE_DIRECTORY" = "directory"
}
/**
 * @method refreshColumnData 刷新分栏
 * @param {*} fileListColumn
 * @param {*} list
 * @param {*} data
 */
const refreshColumnData = (fileListColumn: any, list: any, data: any) => {


}
/**
 * @method getListInfo 根据传入路径获取目录详情
 * @param {*} list
 * @param {string[]} path 路径的数组集合
 */
const getListInfo = (list: any, path: string[]) => {
    let findList = list;
    for (let v of path) {
        findList = getDirectoryList(v, findList, Math.floor((v.split('-').length + 1) / 2))
    }

    return findList;
}

const dragHandle = {
    apiList: {
        "file": {
            method: 'PUT',
            url: "/api/file/image/update/path"
        },
        "directory": {
            method: 'PUT',
            url: "/api/file/files/update/path"
        }
    },
    /**
     * @method temporarySliceMenuData 临时移除对应menus中的显示
     * @param {*} fileListColumn
     * @param {*} node 节点数据，移动的那个
     */
    temporarySliceMenuData(fileListColumn: any, node: any) {
        let level = node.level - 1;
        let menuData = fileListColumn.value.menus[level];
        let spliceIdx = 0;
        for (let i = 0; i < menuData.length; i++) {
            if (menuData[i].value === node.value) {
                spliceIdx = i;
            }
        }

        return spliceIdx;
    },
    /**
     * @method foundDropMenu 寻找存放的menu位置在什么地方
     * @param {*} fileListColumn 
     * @param {*} domData dom数据，用来做比较的
     */
    foundDropMenu(fileListColumn: any, domData: any) {
        let idx = 0;

        for (let v of fileListColumn.value.menuList) {
            if (domData === v.$el) {
                return idx;
            }
            idx++;
        }

        return null;
    },
    /**
     * @method getParentIndex 获取父级的下标
     * @param {*} fileListColumn 
     * @param {number} index menuList的下标位置
     */
    getParentIndex(fileListColumn: any, index: number) {
        if (!index && index != 0) {
            return null;
        }
        if (fileListColumn.value.menuList[index].nodes.length == 0) {
            let modalValue = fileListColumn.value.menuList[index].$parent.modelValue;
            return modalValue;
        }
        let parentData = fileListColumn.value.menuList[index].nodes[0].pathValues;
        let parent = parentData.slice(0, parentData.length - 1);

        return parent;
    },
    /**
     * @method hasSameName 判断是否在父级目录下存在同名文件
     * @param {*} fileListColumn
     * @param {number} index menuList的下标位置
     * @param {string} type 文件类型：文件 文件目录
     * @param {string} name 移动文件的名称
     */
    hasSameName(fileListColumn: any, index: number, type: string, name: string): boolean {
        if (!index && index != 0) {
            return true;
        }
        if (fileListColumn.value.menuList[index].nodes.length == 0) {
            return false;
        }
        let childrenList = fileListColumn.value.menuList[index].nodes
        for (let v of childrenList) {
            let cT = v.data.is_file ? 'file' : 'directory';
            if (v.data.name == name && cT === type) {
                return true;
            }
        }


        return false;
    },
    /**
     * @method canSubmitChange 能否提交修改
     * @param {*} dragInfo 拖拽信息 
     */
    canSubmitChange(dragInfo: any) {
        let returnData = { status: true, message: '' };
        if (!dragInfo.parent) {
            returnData.status = false;
            returnData.message = '请移动到有效的文件目录下！';
            return returnData;
        }
        if (dragInfo.sameName) {
            returnData.status = false;
            returnData.message = '该文件目录下存在同名文件/文件夹！';
            return returnData;
        }
        if (dragInfo.dragData.index === dragInfo.parent[dragInfo.parent.length - 1]) {
            returnData.status = false;
            returnData.message = '请不要把文件/目录移动到奇怪的地方！';
            return returnData;
        }
        return returnData;
    },
    /**
     * @method editFilePath 修改文件路径，包括请求等内容的集合
     * @param {*} list 路径集合
     * @param {string[]} parentPath 父路径内容
     * @param {MenuDataList} dragData 等待修改的内容
     * @param {string} oldPath 老的路径
     */
    async editFilePath(list: any, parentPath: string[], dragData: MenuDataList, oldPath: string) {
        let directory_id = null;
        let relative_path = null;

        oldPath = preFilePath + (oldPath.length == 0 ? '' : `/${oldPath}`);
        if (parentPath.length == 0) {
            directory_id = 1;
            relative_path = '/file/link';
        } else {
            let info = getListInfo(list, parentPath);
            //NOTE: directory_id更新位置后的目录id, id是需要更新的文件或目录的id
            directory_id = info.id;
            relative_path = info.relative_path;
        }

        let id = dragData.id;
        let type: string = dragData.is_directory ? 'directory' : 'file';
        let apiInfo = Reflect.get(this.apiList, type);
        //NOTE: 发起修改文件路径的请求
        let responseData = await axios({
            method: apiInfo.method,
            url: apiInfo.url,
            data: {
                id,
                directory_id,
                relative_path,
                oldPath
            }
        })
        if (responseData.data.status) {
            return true;
        } else {
            return false;
        }
    },
    /** 
     * @method getDragLevel 获取移动后的层级
     * @param {string[]} dropPath 以后的路径表
    */
    getDragLevel(dropPath: string[]) {
        let level = 0;
        if (dropPath.length == 0) {
            level = 0;
        } else {
            level = Math.floor((dropPath[dropPath.length - 1].split('-').length + 1) / 2)
        }
        return level;
    },
    /**
     * @method updateNodeData 更新节点数据
     * @param {*} node 节点数据，移动的那个
     * @param {*} prenode 前置节点数据
     * @param {*} root 是否是根节点插入
     */
    async updateNodeData(node: any, prenode: any, root: boolean = false) {
        let oldV = node.value.split('-');
        let newV = oldV.slice(oldV.length - 2);
        let data = await getInfo(node.data.id, 'file')
        node.data = changeFileInfoToMenuData(data);
        if (root) {
            node.data.index = newV.join('-');
            node.level = 1;
            node.value = newV.join('-');
            node.parent = undefined;
            node.pathNodes = node;
            node.pathLabels = [node.label];
            node.pathValues = [node.value];
            return;
        }
        node.data.index = prenode.value + '-' + newV.join('-');
        node.level = prenode.level + 1;
        node.value = prenode.value + '-' + newV.join('-');
        // console.log(prenode);
        // debugger
        node.pathLabels = [...prenode.pathLabels, node.label];
        node.pathValues = [...prenode.pathValues, node.value];
        node.pathNodes = Array.isArray(prenode.pathNodes) ? [...prenode.pathNodes, node] : [prenode.pathNodes, node];
        node.parent = prenode;
    },
    /**
     * @method changeFileMenuList 修改menu中数据，更新移动后的列表显示(文件的修改)
     * @param {*} fileListColumn
     * @param {*} list 数据内容
     * @param {*} node 节点数据，移动的那个
     * @param {string[]} dropPath 最终落位的地址
     * @param {number} idx 旧节点的位置
     */
    async changeFileMenuList(fileListColumn: any, list: any, node: any, dropPath: string[], idx: number) {
        let dropInfo = getListInfo(list, dropPath);
        let oldPath = node.pathValues.slice(0);
        oldPath.length != 0 && oldPath.pop();
        if (oldPath.length == 0) {
            list.delete(node.value);
        } else {
            let oldParentIndex = getListInfo(list, oldPath);
            oldParentIndex.children.delete(node.value);
        }
        let level = this.getDragLevel(dropPath);
        //NOTE: 移除原先节点列表中的数据
        let oldLevel = node.level - 1;
        let oldMenuData = fileListColumn.value.menus[oldLevel];
        oldMenuData.splice(idx, 1);
        //NOTE: 需要去更新一下Node节点的数据，因为里面的内容发生了改变
        let preMenu = fileListColumn.value.menus[level == 0 ? level : level - 1];
        if (level === 0) {
            await this.updateNodeData(node, null, true);
        } else {
            let preNode = null;
            for (let v of preMenu) {
                if (v.value === dropInfo.index) {
                    preNode = v;
                    break;
                }
            }
            await this.updateNodeData(node, preNode);
            dropInfo.children.set(node.value, node.data);
        }
        //NOTE: 更新完成之后，放入到当前目标的列表中去
        let menuData = fileListColumn.value.menus[level];
        menuData.push(node);

        return true;
    },
    /**
     * @method updateDirectoryNode 更新目录节点的数据
     * @param {*} node 目录节点
     * @param {*} prenode 前置节点数据
     * @param {*} root 是否是根节点插入
     */
    async updateDirectoryNode(node: any, prenode: any, root: boolean = false) {
        node.children = [];
        node.childrenData = [];
        node.loaded = false;
        let oldV = node.value.split('-');
        let newV = oldV.slice(oldV.length - 2);
        let data = await getInfo(node.data.id, 'directory')
        node.data = changeDirectoryInfoToMenuData(data);
        if (root) {
            node.data.index = newV.join('-');
            node.level = 1;
            node.value = newV.join('-');
            node.parent = undefined;
            node.pathNodes = node;
            node.pathLabels = [node.label];
            node.pathValues = [node.value];
            return;
        }
        node.data.index = prenode.value + '-' + newV.join('-');
        node.level = prenode.level + 1;
        node.value = prenode.value + '-' + newV.join('-');
        node.pathLabels = [...prenode.pathLabels, node.label];
        node.pathValues = [...prenode.pathValues, node.value];
        node.pathNodes = [...prenode.pathNodes, node];
        node.parent = prenode;
        //NOTE: 直接放入到prenode的两块内容下，就不需要再自己手动去放了，因为是响应式的，会自动渲染出来
        prenode.children.push(node);
        prenode.childrenData.push(node.data);
    },
    /**
     * @method changeDirectoryMenuList 修改menu中数据，更新移动后的列表显示(文件目录的修改)
     * @description 介绍一下这个函数需要干的事情
     * 1. 先区分当前这个移动的节点是不是展开的节点，如果是展开的节点，就需要取消展开，变为落位后的父级展开
     * 2. 更新node元素,list数据，menuList,menus数据，部分状态需要被清除掉
     * @param {*} fileListColumn
     * @param {*} list 数据内容
     * @param {*} dragInfo 拖拽数据信息
     * @param {*} checkedValue 当前选中节点的数据列表
     */
    async changeDirectoryMenuList(fileListColumn: any, list: any, dragInfo: any, checkedValue: any) {
        let node = dragInfo.dragNode;
        let data = dragInfo.dragData;
        let menuList = fileListColumn.value.menuList;
        let menus = fileListColumn.value.menus;
        let checkedIdx = checkedValue.value.indexOf(data.index);
        //NOTE: 如果这个目录是被选中且展开的,那就需要重新维护一下checkedValue的值，然后触发watch，关闭展开,需要主动删除menuList里的展开节点值
        if (checkedIdx !== -1) {
            checkedValue.value = checkedValue.value.slice(0, checkedIdx);
            menus[checkedIdx].splice(dragInfo.dragMenuIdx, 1);
            menus.splice(checkedIdx + 1, menus.length - (checkedIdx + 1));
            menuList.splice(checkedIdx + 1, 1);
        } else {
            //NOTE: 移除原先节点列表中的数据
            let oldLevel = node.level - 1;
            let oldMenuData = fileListColumn.value.menus[oldLevel];
            oldMenuData.splice(dragInfo.dragMenuIdx, 1);
        }
        //NOTE: 下面就是要更新一下node以及list的值
        let dropPath = dragInfo.parent;
        let level = this.getDragLevel(dropPath);
        let dropInfo = getListInfo(list, dropPath);
        //NOTE: 获取前置menu
        let preMenu = fileListColumn.value.menus[level == 0 ? level : level - 1];
        if (level === 0) {
            await this.updateDirectoryNode(node, null, true);
            dropInfo.set(node.value, node.data);
            menus[0].push(node)
        } else {
            let preNode = null;
            for (let v of preMenu) {
                if (v.value === dropInfo.index) {
                    preNode = v;
                    break;
                }
            }
            await this.updateDirectoryNode(node, preNode);
            dropInfo.children.set(node.value, node.data);
        }
        fileListColumn.value.menuList = fileListColumn.value.menuList.filter((v: any) => v != null);
        return true;
    }
}

export {
    HandleFile,
    refreshColumnData,
    dragHandle
}