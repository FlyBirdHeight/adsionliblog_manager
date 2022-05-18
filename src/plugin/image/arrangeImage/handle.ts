import { getDirectoryList, MenuDataList, changeFileInfoToMenuData } from './arrange'
import axios from 'axios';
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
     * @method foundDropMenu 寻找存放的menu位置在什么地方
     * @param {*} fileListColumn 
     * @param {*} domData dom数据，用来做比较的
     */
    foundDropMenu(fileListColumn: any, domData: any) {
        let idx = null
        fileListColumn.value.menuList.forEach((v: any, i: number) => {
            if (domData === v.$el) {
                idx = i
            }
        })
        return idx
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
     * @method updateNodeData 更新节点数据
     * @param {*} node 节点数据，移动的那个
     * @param {*} prenode 前置节点数据
     * @param {*} root 是否是根节点插入
     */
    async updateNodeData(node: any, prenode: any, root: boolean = false) {
        let oldV = node.value.split('-');
        let newV = oldV.slice(oldV.length - 2);
        let data = await axios({
            method: "GET",
            url: "/api/file/image/get/info?id=" + node.data.id
        })
        let newFileInfo = data.data.data;
        node.data = changeFileInfoToMenuData(newFileInfo);
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
    },
    /**
     * @method changeMenuList 修改menu中数据，更新移动后的列表显示
     * @param {*} fileListColumn
     * @param {*} list 数据内容
     * @param {*} node 节点数据，移动的那个
     * @param {MenuDataList} data 数据内容，更新list的数据
     * @param {string[]} dropPath 最终落位的地址
     */
    async changeMenuList(fileListColumn: any, list: any, node: any, dropPath: string[], idx: number) {
        let dropInfo = getListInfo(list, dropPath);
        let oldPath = node.pathValues.slice(0);
        oldPath.length != 0 && oldPath.pop();
        if (oldPath.length == 0) {
            list.delete(node.value);
        } else {
            let oldParentIndex = getListInfo(list, oldPath);
            oldParentIndex.children.delete(node.value);
        }

        // debugger
        let level = 0;
        if (dropPath.length == 0) {
            level = 0;
        } else {
            level = Math.floor((dropPath[dropPath.length - 1].split('-').length + 1) / 2)
        }
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
    }
}

export {
    HandleFile,
    refreshColumnData,
    dragHandle
}