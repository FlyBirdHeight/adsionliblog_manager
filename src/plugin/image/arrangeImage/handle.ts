import { getDirectoryPathList, handleGetDirectoryListData } from './arrange'

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

export {
    HandleFile,
    refreshColumnData
}