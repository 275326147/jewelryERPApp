/**
 * Created by Simon on 2017/6/26 0026.
 */

import axios from 'axios';

export default HttpsImg = async function (fileCategory, fileInfo) {
    let formData = new FormData();
    formData.append('type', 3);
    formData.append('fileName', fileInfo.fileName);
    formData.append('businessParam', fileCategory);

    return new Promise((resolve, reject) => {

        axios.post(config.uploadTokenServer + 'oss/getToken.do', formData, )
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                console.log(err)
            })
    }).then(result => {

        return fetch(config.qiniuServer + result.key, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'UpToken ' + result.token
            },
            body: fileInfo.data,
        })
    }).then(response => {
        return response.json()
    })
        .then(result => {
            if (result.key) {
                return result.key
            }
            throw '上传图片出错'
        }).catch(e => {
            console.log("上传错误", e)
            throw e
        })

}


