let SparkMD5 = require('spark-md5');
/**
 * NOTE: 这里主要用来对文件进行分片以及hash的操作
 */
type Deadline = {
    timeRemaining: () => number,
    didTimtout: boolean
}
type UploadFile = {
    file: File,
    sliceFile?: Blob[],
    name: string,
    is_create: boolean,
    directory_id: number | null,
    status: string,
    path: string,
    hash?: any
}
/**
 * @property {number} taskCount 任务数量
 * @property {boolean} hashAll 对全部文件进行hash
 * @property {File[]} fileList 文件列表
 * @property {number} freeChannels 空闲通道数
 * @property {number} maxChannels 并发控制最大通道数
 * @property {number} minSliceSize 最小切割文件大小(单位：字节)
 * @property {number} sliceTagSize 切割文件标识大小(单位：字节)
 * @property {number[]} dataSliceNumber 数据分片份数
 */
const fileList: File[] = [];
const freeChannels = 5;
const maxChannels = 5;
const minSliceSize = 512 * 1024;
const sliceTagSize = 2;
const dataSliceNumber = 10;
/**
 * @method hashFile 处理文件hash
 * @param {File} file 待处理文件 
 */
const hashFileList = (file: UploadFile) => {
    return new Promise((resolve, reject) => {
        let taskCount = file.sliceFile?.length || 0;
        let currentTask = 0;
        const spark = new SparkMD5.ArrayBuffer();
        if (taskCount === 0) {
            resolve([]);
        }
        let hashAll = false;
        const doFileHash = async (deadline: Deadline) => {
            while (taskCount > 0 && deadline.timeRemaining() > 1 && !hashAll) {
                let sparkData = await hash(file?.sliceFile![currentTask], currentTask, file.sliceFile?.length || 0)
                currentTask++;
                if (taskCount == 0) {
                    resolve(sparkData)
                    hashAll = true;
                    break;
                }
            }
            if (taskCount > 0 && !hashAll) {
                window?.requestIdleCallback!(doFileHash);
            }
        }
        const hash = (sliceFile: Blob, currentIdx: number, fileSize: number) => {
            return new Promise((resolve, reject) => {
                if (fileSize == 0) {
                    return "";
                }
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(sliceFile);
                fileReader.onload = function (e) {
                    let sliceData = extractDataSlice(e.target?.result, currentIdx, fileSize);
                    if (sliceData.length === 0 && taskCount - 1 != 0) {
                        taskCount--;
                        resolve(null);
                    }
                    sliceData.forEach(v => {
                        spark.append(v);
                    })
                    taskCount--;
                    if (taskCount === 0) {
                        resolve(spark.end())
                    }
                    resolve(null);
                }
            })
        }
        window?.requestIdleCallback!(doFileHash);
    })
}
/**
 * @method sliceFile 切割文件
 * @param {File} file 待处理文件
 * @param {number} size 文件切割大小
 */
const sliceFile = (file: File, size: number = minSliceSize): Blob[] => {
    if (file.size < minSliceSize) {
        return [file];
    }
    const fileChunkList: Blob[] = [];
    let cur = 0;
    while (cur < file.size) {
        if (cur + size > file.size) {
            fileChunkList.push(file.slice(cur, file.size, file.type));
            break;
        }
        fileChunkList.push(file.slice(cur, cur + size, file.type));
        cur += size;
    }

    return fileChunkList;
}

/**
 * @method extractDataSlice 提取数据分片
 * @param {*} data 分片数据 
 * @param {number} currentIdx 当前数据分片下标
 * @param {number} fileSize 文件分片数据大小
 */
const extractDataSlice = (data: any, currentIdx: number, fileSize: number) => {
    if (!data || fileSize === 0) {
        return [];
    }
    //第一段数据分片与第二段数据分片
    if (currentIdx === 0 && fileSize !== 0) {
        return [data];
    } else if (currentIdx === fileSize - 1 && fileSize !== 0 && fileSize > 1) {
        return [data];
    }
    let returnData: ArrayBuffer[] = [];
    let iterations = dataSliceNumber;
    let size = data.byteLength;
    if (size === 0) {
        return [];
    }
    if (size < iterations * sliceTagSize) {
        return [data];
    }
    for (let i = 0; i < iterations - 1; i++) {
        let startPosition = i == 0 ? 0 : Math.ceil(size / i);

        returnData.push(data.slice(startPosition, startPosition + sliceTagSize));
    }
    //NOTE: 这里就是放入一段中间分片时的结尾片段
    returnData.push(data.slice(size - sliceTagSize, size));

    return returnData;
}

/**
 * @method handleAndUpload 处理并上传文件
 * @param {File[]} fileList 文件列表
 */
const handleAndUpload = async (fileList: UploadFile[]) => {
    const fileListSlice = fileList.map(v => {
        v.sliceFile = sliceFile(v.file);
        return v;
    })
    await fileListSlice.forEach(async v => {
        v.hash = await hashFileList(v);

        return v;
    });
    // console.log(fileListSlice);

}



export {
    handleAndUpload
}