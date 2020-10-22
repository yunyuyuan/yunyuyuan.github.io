// 直接从站点上获取文件text
import {originPrefix} from "@/need";

export async function getText(path) {
    return new Promise(resolve => {
        fetch(path+'?ran='+new Date().getTime()).then(res => {
            res.text().then(res => {
                resolve([true, res])
            }).catch(err => {
                resolve([false, err])
            })
        }).catch(err => {
            resolve([false, err])
        })
    })
}

export function parseAjaxError(err) {
    if (err.response) {
        let status = err.response.status;
        switch (status) {
            case 401:
                return "错误: 未授权,请检查token是否正确";
            case 404:
                return "错误: 不存在那个文件";
            case 403:
                return "错误: 访问受限";
            default:
                return `错误码: ${status}`
        }
    }
    switch (err.message) {
        case "Network Error":
            return `网络错误: ${err}，请检查网络连接`;
        default:
            return `未知错误: ${err}`;
    }
}

export function stringToB64(s) {
    return btoa(unescape(encodeURIComponent(s)))
}

export function sortByTime(lis) {
    lis.sort((a, b) => {
        return a.time > b.time ? -1 : 1
    })
}

export function loadFinish (){
    document.querySelector('#loading').setAttribute('hide', '');
}