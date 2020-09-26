import axios from 'axios';
import siteConfig from '@/site-config';

const owner = siteConfig.owner,
    repo = `${owner}.github.io`,
    headers = {
        Authorization: 'token bad9e3ab6ae55284479643a35e13f82bec8c146f'
    }

export async function getNumber() {
    return new Promise(resolve => {
        axios.get(`https://api.github.com/repos/${owner}/${repo}`)
            .then(res => {
                resolve([true, res])
            }).catch(err => {
            resolve([false, err])
        })
    })
}

export async function getPageComment(page, count) {
    return new Promise(resolve => {
        axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?page=${page}&per_page=${count}`)
            .then(res => {
                resolve([true, res])
            }).catch(err => {
            resolve([false, err])
        })
    })
}

export async function createComment(payload) {
    return new Promise(resolve => {
        axios.post(`https://api.github.com/repos/${owner}/${repo}/issues`, payload, {
            headers: headers
        })
            .then(res => {
                resolve([true, res])
            }).catch(err => {
            resolve([false, err])
        })
    })
}