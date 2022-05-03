import axios from "axios"

interface FileMenu {
    name: string,
    id: number
}
interface FileListOptions {
    parent_id: number,
    first: boolean
}

interface Directory {
    id: number,
    name: string,
    directory_size: number,
    image_count: number,
    directory_count: number,
    created_at: string,
    updated_at?: string,
    file_count: number,
    parent_id: number,
    level: number,
    relative_path: string,
    size: number,
    directories: Directory[],
    files: FileInfo[]
}

interface FileInfo {
    id: number,
    name: string,
    created_at: string,
    path: string,
    url: string,
    des?: string,
    size: number,
    type: number,
    directory_id: number,
    updated_at?: string
}
/**
 * @interface MenuDataList 用于文件列表生成的数据
 * @property {number} id 正常的id，不过这里是文件夹对应的是文件夹的id，文件对应文件的id
 * @property {string} name 名称
 * @property {string} created_at 创建时间
 * @property {boolean} is_directory 是否是文件夹
 * @property {boolean} is_file 是否是文件
 * @property {string} icon 图标
 * @property {number} size 文件大小
 * @property {number} file_type 文件类型(只针对是文件时)
 * @property {MenuDataList[]} children 子文件夹
 */
interface MenuDataList {
    id: number,
    index: string,
    name: string,
    created_at: string,
    is_directory: boolean,
    is_file: boolean,
    icon: string,
    size: number,
    parent_id: number,
    updated_at?: string,
    url?: string,
    relative_path?: string,
    path?: string,
    file_type?: number,
    children?: Map<string, MenuDataList>,
    getChildren?: boolean,
    level?: number
}

enum FileType {
    "IMAGE" = 0,
    "PAGE" = 1,
}

/**
 * @method getFileIcon 根据文件类型获取对应icon
 * @param {number} type 文件类型 
 */
const getFileIcon = (type: number): string => {
    switch (type) {
        case FileType.IMAGE:
            return 'PictureFilled';
        case FileType.PAGE:
            return 'Document';
        default:
            return 'Files';
    }
}

/**
 * @method changeFileInfoToMenuData 将文件转成列表数据
 * @param {FileInfo} file 文件数据 
 * @param {number} parent_id 父文件夹id
 */
const changeFileInfoToMenuData = (file: FileInfo, parent_id: number): MenuDataList => {
    let data: MenuDataList = {
        id: file.id,
        name: file.name,
        created_at: file.created_at,
        url: file.url,
        path: file.path,
        icon: getFileIcon(file.type),
        is_directory: false,
        is_file: true,
        size: file.size,
        file_type: file.type,
        parent_id: file.directory_id,
        updated_at!: file?.updated_at,
        index: ''
    };

    return data;
}
/**
 * @method changeDirectoryInfoToMenuData 将文件夹数据转换成可视化列表数据
 * @param {Directory} directory 文件
 * @param {boolean} isChild 是否是子文件夹
 */
const changeDirectoryInfoToMenuData = (directory: Directory, isChild: boolean = false) => {
    let data: MenuDataList = {
        id: directory.id,
        name: directory.name,
        created_at: directory.created_at,
        updated_at!: directory?.updated_at,
        relative_path: directory.relative_path,
        icon: 'Folder',
        is_directory: true,
        is_file: false,
        size: directory.directory_size,
        parent_id: directory.parent_id,
        getChildren: !isChild ? true : false,
        children: new Map<string, MenuDataList>(),
        level: directory.level,
        index: ''
    }

    return data;
}

/**
 * @method handleMenuList 将文件夹，文件数据处理成可以可视化的列表数据,这里不是最终的，只是为了之后可以方便读取
 * @param {Directory[]} fileList 待处理数据
 * @param {string} pre_index 前置index
 * @param {boolean} isChild 是否是子节点
 */
const handleMenuList = (fileList: Directory[], preOpt: { index: string, id: number } = { index: '', id: 1 }, isChild: boolean = false): Map<string, MenuDataList> => {
    let returnData: Map<string, MenuDataList> = new Map<string, MenuDataList>();
    for (let value of fileList) {
        let index = '';
        if (value.level == 1) {
            index = value.id.toString();
        } else if (preOpt.id !== value.id) {
            index = `${preOpt.index}-d-${value.id}`
        } else {
            index = preOpt.index
        }
        let children = new Map<string, MenuDataList>();
        if (Reflect.has(value, 'files') && value.files.length != 0) {
            for (let file of Reflect.get(value, 'files')) {
                let menuData = changeFileInfoToMenuData(file, value.id);
                menuData.index = `${index}-f-${file.id}`
                children.set(menuData.index, menuData);
            }
        }
        if (Reflect.has(value, 'directories') && value.directories.length != 0) {
            let data = handleMenuList(value.directories, { index, id: value.id }, true);
            if (data.size != 0) {
                for (let [k, v] of data.entries()) {
                    Reflect.deleteProperty(v, 'children')
                    children.set(v.index, v);
                }
            }

        }
        let data = changeDirectoryInfoToMenuData(value, isChild);

        data.index = index;
        data.children = children;
        returnData.set(data.index, data);
    }

    return returnData;
}


/**
 * @method handleFileData 处理文件数据，放入到相关文件夹内容下
 * @param {MenuDataList} parentList 父文件夹
 * @param {Directory[]} fileList 待处理文件列表
 * @param {boolean} first 是否是第一次
 */
const handleFileData = (parentList: MenuDataList, fileList: Directory[], first: boolean = false) => {
    if (fileList.length == 0) {
        return;
    }
    if (first) {
        let value = handleMenuList(fileList);
        return value;
    } else {
        let value = handleMenuList(fileList, { index: parentList.index, id: parentList.id }, false);
        return value;
    }
}
/**
 * @method getFileList 获取文件列表
 * @param {FileListOptions} options 获取配置项
 */
const getFileList = async (options: FileListOptions = { parent_id: 1, first: true }) => {
    try {
        const resData = await axios({
            method: "get",
            data: options,
            url: `/api/file/files/getList?id=${options.parent_id}&first=${Number(options.first)}`
        })
        let fileList: any = resData.data.data;

        return fileList;
    } catch (e) {
        console.log(e);
    }
}

/**
 * @method returnMenuData 最终完成对menu数据的处理，返回menu可以理解的数据格式
 * @param {Map<string, MenuDataList>} menuData
 */
const returnMenuData = (menuData: Map<string, MenuDataList>) => {
    if (menuData.size == 0) {
        return [];
    }
    let data = new Map(menuData);
    let returnData = [];
    for (let [k, v] of data.entries()) {
        let value: any = v
        let children = [];
        if (value.children && value.children.size > 0) {
            for (let [k, v] of new Map(value.children).entries()) {
                children.push(v);
            }
        }

        value.children = children;
        returnData.push(value)
    }

    return returnData;
}

/**
 * @method getMenuData 获取Menu列表可视化数据
 * @param {MenuDataList} parent 父类数据 
 * @param {boolean} first 第一次请求
 */
const getMenuData = async (parent: MenuDataList, first: boolean = false) => {
    try {
        if (!first && Reflect.has(parent, 'getChildren') && parent.getChildren) {
            return returnMenuData(parent.children || new Map<string, MenuDataList>());
        }
        let fileList: any = await getFileList({
            parent_id: parent.id,
            first
        });

        if (!first) {
            let data = handleFileData(parent, fileList);
            parent.children = data?.get(parent.index)?.children;
            Reflect.set(parent, 'getChildren', true);

            return returnMenuData(parent.children || new Map<string, MenuDataList>());
        } else {
            let children = handleFileData(parent, fileList, true);
            return children;
        }

    } catch (e) {
        console.log(e);
    }
}
/**
 * @method getDirectoryList 根据传入的index，找到相关的内容
 * @param {T} index
 * @param {*} list 父对象数据
 * @param {number} level 层级
 */
const getDirectoryList = <T>(index: T, list: any, level: number) => {
    if (level == 2) {
        for (let i = 0; i < list.children.length; i++) {
            if (list.children[i].index == index) {
                return list.children[i]
            }
        }
    } else if (level == 1) {
        return list.get(index)
    } else {
        return list.children.get(index);
    }
}
/**
 * @method handleGetDirectoryListData 因为list第二层变成了数组，所以需要一些特殊处理的内容，调用这个方法
 * @param {*} list 父对象数据
 * @param {string} index 查询的index
 */
const handleGetDirectoryListData = (list: any, index: string) => {
    let idx = index.substr(0).split('-')
    let value = []
    for (let i = 0; i < idx.length; i += 2) {
        value.push(idx.slice(0, i + 1).join('-'))
    }
    let findList = list
    for (let v of value) {
        findList = getDirectoryList(v, findList, (v.split('-').length + 1) / 2)
    }

    return findList;
}

export {
    FileInfo,
    handleFileData,
    getFileList,
    FileMenu,
    MenuDataList,
    getMenuData,
    returnMenuData,
    getDirectoryList,
    handleGetDirectoryListData,
    FileType
}

