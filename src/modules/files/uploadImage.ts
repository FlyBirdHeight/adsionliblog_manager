import axios from 'axios';
interface UploadImageResponse {
    message: string,
    status: boolean,
    url: string,
    rewrite: boolean,
    id?: number
}
interface WritingForm {
    title: string
    subTitle: string
    description: string
    writingDate: string
    page: string
}

interface UploadStatus {
    precent: number
    status: string
}
class UploadImage {
    /**
     * @method uploadImage
     * @param {FileList} files 文件列表
     * @return {Promise<Array<UploadImageResponse>>}
     */
    uploadImage(files: FileList) {
        return Promise.all(
            Array.from(files).map((file) => {
                return new Promise((resolve, reject) => {
                    const form = new FormData()
                    form.append('image', file)
                    axios.post('/api/file/image/upload', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then((res) => {
                        resolve(res.data)
                    }).catch((e) => {
                        console.log(e)
                    })
                })
            })
        )
    }
}

export {
    UploadImage,
    UploadImageResponse,
    WritingForm,
    UploadStatus
};