import axios from "axios";
import utility from "@/utility";
const BASE_URL = process.env.NODE_ENV === 'development' ? '': '../diary-portal/'


function request(method, requestData = {}, url) {

    // 所有 requestData 都会自动添加  authorization 信息
    // 给 requestData 添加 authorization 内部的数据： username email uid 等等
    if (url !== 'user/login' && url !== 'user/register'){ // 注册和登录时不添加 Token 数据
        Object.assign(requestData, utility.getAuthorization())
    }

    // 根据不同请求方式，调换 params 和 requestData 内容
    let headers
    let params
    switch (method){
        case 'get':
        case 'patch':
        case 'delete':
            params = requestData
            requestData = null
            headers =  {'content-type': 'multipart/form-data'}
            break;
        case 'put':
        case 'post':
            headers = {'content-type': 'application/json'}
            break;
    }

    return new Promise((resolve, reject) => {
        axios({
            url: BASE_URL + url,
            method,
            data: requestData,
            params,
            headers,
            withCredentials: true
        })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.success){
                        resolve(res.data)
                    } else {
                        console.log('request err: ', res.data) // 如果演示模式，不用显示网络请求错误
                        reject(res.data)
                    }
                } else {
                    console.log('request err: ', res.data) // 如果演示模式，不用显示网络请求错误
                }
            })
            .catch(err => {
                if (err.response) {
                    console.log('response: ', err.response)
                } else if (err.request) {
                    console.log('request: ', err.request)
                } else if (err.message) {
                    console.log('message: ', err.message)
                }
            })
    })
}


export default request
