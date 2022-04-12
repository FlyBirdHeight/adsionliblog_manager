import axios from "axios"

interface FileMenu {
    name: string,
    id: number
}
interface FileListOptions {
    parent_id: number,
    level: number,
    sort: string,
    orderBy: string
}

interface Directory {
    id: number,
    name: string,
    directory_size: number,
    image_count: number,
    directory_count: number,
    created_at: string,
    file_count: number,
    parent_id: number,
    level: number,
    full_path: string,
    size: number,
    children: Directory[],
    fileList: FileInfo[]
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
    directory_id: number
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
    url?: string,
    full_path?: string,
    path?: string,
    file_type?: number,
    children?: Map<string, MenuDataList>,
    getChildren?: false,
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
        index: ''
    };

    return data;
}
/**
 * @method changeDirectoryInfoToMenuData 将文件夹数据转换成可视化列表数据
 */
const changeDirectoryInfoToMenuData = (directory: Directory) => {
    let data: MenuDataList = {
        id: directory.id,
        name: directory.name,
        created_at: directory.created_at,
        full_path: directory.full_path,
        icon: 'Folder',
        is_directory: true,
        is_file: false,
        size: directory.size,
        parent_id: directory.parent_id,
        getChildren: false,
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
 */
const handleMenuList = (fileList: Directory[], pre_index: string = ''): Map<string, MenuDataList> => {
    let returnData: Map<string, MenuDataList> = new Map<string, MenuDataList>();
    for (let value of fileList) {
        let index = '';
        if (value.level == 0) {
            index = value.id.toString();
        } else {
            index = `${pre_index}-${value.id}`
        }
        let children = new Map<string, MenuDataList>();
        if (value.fileList.length != 0) {
            for (let file of Reflect.get(value, 'fileList')) {
                let menuData = changeFileInfoToMenuData(file, value.id);
                menuData.index = `${pre_index}-${file.id}`
                children.set(menuData.index, menuData);
            }
        }
        if (value.children.length != 0) {
            handleMenuList(value.children, index);
        }
        let data = changeDirectoryInfoToMenuData(value);
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
 */
const handleFileData = (parentList: MenuDataList, fileList: Directory[]) => {
    if (fileList.length == 0) {
        return;
    }
    let value = handleMenuList(fileList);

    return value;
}
/**
 * @method getFileList 获取文件列表
 * @param {FileListOptions} options 获取配置项
 */
const getFileList = async (options: FileListOptions = { parent_id: -1, level: 0, sort: "created_at", orderBy: "desc" }) => {
    try {
        const resData = await axios({
            method: "post",
            data: options,
            url: "/api/file/getList"
        })
        const fileList: Directory[] = resData.data;
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
        value.children = []
        returnData.push(value)
    }

    return returnData;
}

/**
 * @method getMenuData 获取Menu列表可视化数据
 * @param {MenuDataList} parent 父类数据 
 * @param {number} level 层级
 */
const getMenuData = async (parent: MenuDataList, level: number, index: string) => {
    try {
        if (parent.getChildren) {
            return returnMenuData(parent.children || new Map<string, MenuDataList>());
        }
        let fileList: any = await getFileList({
            parent_id: parent.id,
            level: level,
            sort: "created_at",
            orderBy: "desc"
        });
        let children = handleFileData(parent, fileList);
        parent.children = children;
        Reflect.set(parent, 'getChildren', true);

        return returnMenuData(children || new Map<string, MenuDataList>());
    } catch (e) {
        // console.log(e)
        parent.children = new Map().set(index + '-' + 1, {
            id: 1,
            index: index + '-' + 1,
            name: 'public' + index + '-' + 1,
            created_at: '2022-04-10',
            is_directory: true,
            is_file: false,
            icon: 'Folder',
            size: 0,
            parent_id: 0,
            getChildren: false,
            level: 0,
            children: new Map<string, MenuDataList>(),
        })
        Reflect.set(parent, 'getChildren', true);
        return returnMenuData(parent.children);
    }
}
/**
 * @method getDirectoryList 根据传入的index，找到相关的内容
 * @param {T[]} index
 * @param {Map<string, MenuDataList>} list 父对象数据
 */
const getDirectoryList = <T>(index: T[], list: Map<string, MenuDataList>) => {
    let columnIndex = '' + index[0];
    let data = list.get(columnIndex);
    for (let i = 1; i < index.length; i++) {
        columnIndex += `-${index[i]}`;
        data = data?.children?.get(columnIndex);
    }

    return data;
}


export {
    FileInfo,
    handleFileData,
    getFileList,
    FileMenu,
    MenuDataList,
    getMenuData,
    returnMenuData,
    getDirectoryList
}

