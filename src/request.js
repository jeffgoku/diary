import axios from "axios";
import utility from "./utility";
import router from "@/router";

const BASE_URL = '/portal/'

function request(method, params, requestData = {}, url, timeout = 30000) {

    let headers = {}
    /*
    * 所有 requestData 都会自动添加  authorization 信息
    * 给 requestData 添加 authorization 内部的数据： username email uid 等等
    * */
    if (url !== 'user/login' && url !== 'user/register'){ // 注册和登录时不添加 Token 数据
        let auth = utility.getAuthorization()
        Object.assign(headers, {
            'Diary-Token':  auth && auth.token,
            'Diary-Uid':  auth && auth.uid
        })
    }

    return new Promise((resolve, reject) => {
        axios({
            url: BASE_URL + url,
            method,
            params,
            data: requestData,
            headers,
            timeout,
            withCredentials: true
        })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.success){
                        let newToken = res.headers.get('X-Refreshed-Token')
                        if(newToken)
                        {
                            utility.setAuthorizationToken(newToken)
                        }
                        resolve(res.data)
                    } else {
                        console.log('request err: ', res.data) // 输出错误信息
                        // utility.popMessage('danger', res.data.message, null, 5)
                        reject(res.data)
                    }
                } else {
                    reject(res.data)
                    console.log('request err: ', res.message) // 输出错误信息
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status == 401) {
                        router.replace({name: "Login"})
                        resolve(null)                       
                        return
                    }
                    console.log('response: ', err.response)
                } else if (err.request) {
                    console.log('request: ', err.request)
                } else if (err.message) {
                    console.log('message: ', err.message)
                }
                reject(err)
            })
    })
}


export default request
