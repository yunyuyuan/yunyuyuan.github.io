import axios from 'axios';
import siteConfig from '@/site-config';

const owner = siteConfig.owner,
    repo = `${owner}.github.io`,
    headers = {
        Authorization: 'token f5c05b40309dd20328e96ba000d44cfe1c10d37c'
    },
    http = function (payload) {
        return new Promise(resolve => {
            axios({
                ...payload,
                headers: {
                    ...(payload.headers || {}),
                    ...headers
                }
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

export async function getReactions(type, number) {
    return await http({
        url: `https://api.github.com/repos/${owner}/${repo}/issues${type}/${number}/reactions`,
        method: 'get',
        headers: {
            Accept: "application/vnd.github.squirrel-girl-preview"
        }
    })
}

export async function createComment(payload) {
    return await http({
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        data: payload,
        method: 'post',
    });
}

export async function createReplyComment(payload) {
    return await http({
        url: `https://api.github.com/repos/${owner}/${repo}/issues/${payload.number}/comments`,
        data: payload,
        method: 'post',
    });
}