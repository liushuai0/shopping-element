/**
 * config=>baseURL 公用变量 也可以在当前方法以  const baseURL = 'http://xxxx/api/'
 * ElementUI 引入element-ui  根据后台返回,对其进行消息 提示判断
 * */
import {baseURL} from "./index";
import axios from 'axios'
import ElementUI from 'element-ui'

//请求
axios.interceptors.request.use(
    config => {
        var token = JSON.parse(window.sessionStorage.getItem('token'));
        if (token != ''&&token!=null){
            config.headers.Authorization= token
        };
        return config
    },function(error){
        return Promise.reject(error)}
)



//响应
axios.interceptors.response.use(function (response) {
    //success 此处可以对数据进行处理
    return response
}, function (error) {
    //error  此处可以对数据进行处理
    if (error && error.response.status){
        switch (error.response.status) {
            case 400:
                ElementUI.Message.error('400');
                break;
            case 401:
                ElementUI.Message.error(error.response.data.message);
                // delCookie('userToken');
                break;
            case 403:
                ElementUI.Message.error('403');
                break;
            case 404:
                ElementUI.Message.error('404');
                break;
            default :
                ElementUI.Message.error('其他错误')
        }
    }
    return Promise.reject(error)
})


/**
 * 请求失败
 * */
function errorState (response) {
    console.log(response);
    return response
}

/**
 * 请求成功返回值
 *
 * */
function successState (res) {
    if (res.data.code == 0) {

    }else if(res.data.success == false){
        ElementUI.Message({message: res.data.message,type: 'warning'})
    }
    return res
}

/**
 * axios 封装
 *
 * */
function apiAxios (method, url, params) {

    let httpDefault = {
        method: method,
        baseURL: baseURL,
        url: url,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        data: method === 'POST' || method === 'PUT' ? params : null,
        timeout: 10000
    }

    return new Promise((resolve, reject) => {
        axios(httpDefault)
            .then((res) => {
                successState(res)
                resolve(res.data)
            }).catch((response) => {
            console.log(response);
            errorState(response)
            reject(response)
        })

    })
}
/**
 * 判断对象是否为空
 * */
function isNull(obj) {
    let arr = Object.keys(obj)
    let is = (arr.length == 0)
    return is
}
/**
 * 公开 使用方式直接以 this.postAxios/getAxios(url,params).then(res=>{}).catch(err=>{})
 * */
export default {
    install: function (Vue) {
        Vue.prototype.getAxios = (url, params) => apiAxios('GET', url, params);
        Vue.prototype.postAxios = (url, params) => apiAxios('POST', url, params);

        Vue.prototype.putAxios = (url, params) => apiAxios('PUT', url, params);
        Vue.prototype.deleteAxios = (url, params) => apiAxios('DELETE', url, params);
        Vue.prototype.isNull = (obj) => isNull(obj)
    }
}


