import axios from 'axios';
const uploadAny = (imageList: any) => {
    console.log(imageList);
    
    axios({
        method: "post",
        url: "/api/file/image/upload/any",
        data: imageList
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    })
}


export {
    uploadAny
}