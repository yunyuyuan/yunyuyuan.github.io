// 直接从站点上获取文件text
export async function getText(path) {
    return new Promise(resolve => {
        fetch(path+'?ran='+new Date().getTime()).then(res => {
            res.text().then(res => {
                setTimeout(()=>resolve([true, res]), 1000)
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
        const status = err.response.status;
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

export function throttle(func, interval=100, type='timeout'){
    if (typeof func !== 'function') return;
    let isFirst = true;
    if (type === 'timestamp') {
        let startTime = new Date().getTime();
        return function () {
            const dataNow = new Date().getTime();
            if (isFirst) {
                isFirst = false;
                func.apply(this, arguments);
            } else if (dataNow - startTime >= interval) {
                startTime = dataNow;
                func.apply(this, arguments);
            }
        }
    }else if (type === 'timeout'){
        let handler = null;
        return function (){
            const args = arguments;
            if (isFirst) {
                isFirst = false;
                func.apply(this, args);
            } else if (!handler){
                handler = setTimeout(()=>{
                    func.apply(this, args);
                    handler = null;
                }, interval)
            }
        }
    }
}