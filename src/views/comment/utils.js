import axios from 'axios';
import siteConfig from '@/site-config';

const owner = siteConfig.owner,
    repo = `${owner}.github.io`,
    headers = {
        Authorization: 'token 51ebb721308ba5828657d424e2eb198bd179cd0b'
    },
    http = function (payload) {
        return new Promise(resolve => {
            axios({
                ...payload,
                headers: headers
            }).then(res => {
                resolve([true, res])
            }).catch(err => {
                resolve([false, err])
            })
        })
    }

// ======================== methods ============================

export async function getPageComment(page, count, title) {
    return await http({
        url: `https://api.github.com/search/issues?q=${title}+in:title+repo:${owner}/${repo}&page=${page}&per_page=${count}`,
        method: 'get',
    });
}

export async function getCommentChildren(url) {
    return await http({
        url: url,
        method: 'get',
    });
}

export async function createComment(payload) {
    return await http({
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        data: payload,
        method: 'get',
    });
}