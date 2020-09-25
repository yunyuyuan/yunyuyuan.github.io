import md5 from 'md5';
import axios from 'axios';

const table = 'gitpage',
    headers = {
        'content-type': 'application/json;charset=UTF-8',
        'X-LC-Id': 'lxqgNPckQJMDFguQ6CjVskrg-gzGzoHsz',
        'X-LC-Sign': genSign('8WT5Fa6VLrXjkBQP68scqpCf'),
        'X-LC-Ua': 'LeanCloud-JS-SDK/3.15.0 (Browser)',
    }

// 计算 X-LC-Sign 的签名方法
function genSign(key) {
    const now = new Date().getTime();
    const signature = md5(now + key);
    return `${signature},${now}`;
}

export async function comment(payload) {
    return new Promise(resolve => {
        let params = {
            'ACL': {'*': {read: true}},
            ...payload
        }
        axios.post('https://avoscloud.com/1.1/classes/' + table, params, {
            headers: headers
        }).then(res => {
            resolve([true, res])
        }).catch(err => {
            resolve([false, err])
        })
    })
}

export async function getNumber() {
    return new Promise(resolve => {
        let params = {
            limit: 0,
            count: 1
        }
        axios.get(`https://avoscloud.com/1.1/classes/${table}${objToSearch(params)}`, {
            headers: headers,
        }).then(res => {
            resolve([true, res])
        }).catch(err => {
            resolve([false, err])
        })
    })
}

export function getContent(page, count) {
    return new Promise(resolve => {
        let params = {
            where: JSON.stringify({"$or": [{"parentid": {"$exists": false}}, {"parentid": ""}]}),
            limit: count,
            skip: (page - 1) * count,
            order: '-createdAt'
        }
        axios.get(`https://avoscloud.com/1.1/classes/${table}${objToSearch(params)}`, {
            headers: headers,
        }).then(res => {
            resolve([true, res])
        }).catch(err => {
            resolve([false, err])
        })
    })
}

function objToSearch(obj) {
    let search = '';
    for (let i in obj) {
        search += `&${i}=${encodeURIComponent(obj[i])}`
    }
    return '?' + search.substr(1)
}