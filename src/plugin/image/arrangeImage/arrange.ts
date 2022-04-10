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
    children: Map<number, Directory>,
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
    children?: MenuDataList[]
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
        children: [],
        index: ''
    }

    return data;
}

/**
 * @method handleMenuList 将文件夹，文件数据处理成可以可视化的列表数据
 * @param {Map<number, Directory>} fileList 待处理数据
 * @param {number} parent_id 父类id
 * @param {string} pre_index 前置index
 */
const handleMenuList = (fileList: Map<number, Directory>, parent_id: number, pre_index: string = ''): MenuDataList[] => {
    let returnData: MenuDataList[] = [];
    for (let [key, value] of fileList.entries()) {
        let index = '';
        if (value.level == 0) {
            index = value.id.toString();
        } else {
            index = `${pre_index}-${value.id}`
        }
        let children = [];
        if (value.fileList.length != 0) {
            for (let file of Reflect.get(value, 'fileList')) {
                let menuData = changeFileInfoToMenuData(file, value.id);
                menuData.index = `${pre_index}-${file.id}`
                children.push(menuData);
            }
        }
        if (value.children.size != 0) {
            handleMenuList(value.children, value.id);
        }
        let data = changeDirectoryInfoToMenuData(value);
        data.index = index;
        data.children = children;
        returnData.push(data);
    }


    return returnData;
}


/**
 * @method handleFileData 处理文件数据，放入到相关文件夹内容下
 * @param {Map<number, Directory>} parentList 父文件夹
 * @param {Directory[]} fileList 待处理文件列表
 */
const handleFileData = (parentList: Map<number, Directory>, fileList: Directory[]) => {
    if (fileList.length == 0) {
        return;
    }
    for (let v of fileList) {
        let parent_id = v.parent_id;
        if (!parentList.has(parent_id) && v.level == 0) {
            parentList.set(v.id, v);
        }
        let data = parentList.get(parent_id);
        data?.children?.set(v.id, v);
    }
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


export {
    FileInfo,
    handleFileData,
    getFileList,
    FileMenu,
    MenuDataList
}

