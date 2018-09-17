import axios from 'axios';
import Promise from 'es6-promise';
import router from 'vue-router';
import utrl from "./../controller/utrl.js"

// let isTest = window.location.host
let isTest = window.location.host.indexOf("test.") != -1 ? true : false
const domain = isTest ? "http://test.api.beeerp.com/api/v1/" : "https://api.beeerp.com/api/v1/";
// const domain = "api/";

const headUrl = isTest ? "http://test.api.beeerp.com/api/v1/files/" : "https://api.beeerp.com/api/v1/files/";

const app_key = "F1843533ADA04C358CA826305D5869BF";
const edition = 5;
var loginStatus = false;
var token = null;

// 个人信息
var userInfo = {};

// 公司信息
var mycompanies = [];

//通过polyfill() 解决Promise的兼容问题
Promise.polyfill();

//post请求 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;';//application/x-www-form-urlencoded

// 超时时间
axios.defaults.timeout = 15000;


//添加响应拦截器
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    return res;
}, async (error) => {
    if(error.response.status == 401){
    //     if(localStorage.user && localStorage.pass){
    //         let user = {
    //             uid:localStorage.user,
    //             password:localStorage.pass
    //         }
    //         let res = await utrl.signIn(user)
    //         if(res){
    //             loginStatus = true;
    //             return
    //         }else{
    //             loginStatus = false;
    //             $router.push("/user/login")
    //         }
    //      }
        $router.replace("/user/login")
    }
    return Promise.reject(error);
});

export async function post(url, params) {
    try{
        let body = await axios.post(domain + url, params);
        let resObj = {status:body.status, data:body.data};
        return resObj
    }catch (err){
        let errObj = {status:err.response.status, data:err.response.data}
        return errObj
    }

}
export async function get(url, params) {
    try{
        let body = await axios.get(domain + url, { params: params });
        let resObj = {status:body.status, data:body.data};
        return resObj
    }catch (err){
        let errObj = {status:err.response.status, data:err.response.data}
        return errObj
    }

}

export async function put(url, params) {
    try{
        let body = await axios.put(domain + url, params);
        let resObj = {status:body.status, data:body.data};
        return resObj
    }catch (err){
        let errObj = {status:err.response.status, data:err.response.data}
        return errObj
    }

}

export async function patch(url, params) {
    try{
        let body = await axios.patch(domain + url, params);
        let resObj = {status:body.status, data:body.data};
        return resObj
    }catch (err){
        let errObj = {status:err.response.status, data:err.response.data}
        return errObj
    }

}

export async function deletes(url, params) {
    try{
        let body = await axios.delete(domain + url, { params: params });
        let resObj = {status:body.status, data:body.data};
        return resObj
    }catch (err){
        let errObj = {status:err.response.status, data:err.response.data}
        return errObj
    }

}


// let tradelds = await get("tradelds")

export default{
    get:get,
    post:post,
    put:put,
    patch:patch,
    token:token,
    delete:deletes,
    mycompanies:mycompanies,
    userInfo:userInfo,
    headUrl:headUrl,
    domain:domain,
    loginStatus:loginStatus
}