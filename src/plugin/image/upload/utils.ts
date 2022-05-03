/**
 * @method getUploadStatusColor 获取上传状态列表的文字颜色
 * @param {string} status 文字状态
 */
const getUploadStatusColor = (status: string) => {
    switch (status) {
        case 'ready':
            return '#409EFF'
        case 'uploading':
            return '#E6A23C';
        case 'merge':
            return '#409EFF';
        case 'success':
            return '#67C23A'
        case 'error':
            return '#F56C6C'
        default:
            break
    }
}
/**
 * @method format 获取进度条
 * @param {number} percentage 进度信息
 */
const format = (percentage: number) => (percentage === 100 ? '上传成功' : `${percentage}%`)

export {
    getUploadStatusColor,
    format
}