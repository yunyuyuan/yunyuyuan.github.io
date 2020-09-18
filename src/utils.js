import axios from "axios";

const showdown = require('showdown');
const converter = new showdown.Converter({
    prefixHeaderId: '__markdown_header_id_',
    tables: true,
    tasklists: true,
    backslashEscapesHTMLTags: true,
});

export async function getText(path) {
    return new Promise(resolve => {
        fetch(path).then(res => {
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

export async function updateConfig(gitUtil, config) {
    return new Promise(resolve => {
        gitUtil.updateFile('public/config.json', unescape(encodeURIComponent(JSON.stringify(config, null, 4))), '更新config').then(res => {
            resolve(res)
        })
    })
}

export function parseMarkdown(text) {
    return converter.makeHtml(text)
}

// github
export class GithubUtils {
    constructor(token, user, repo, committer) {
        this.token = token
        this.config = {
            headers: {
                Authorization: `token ${token}`
            }
        }
        this.committer = committer;
        this.user = user;
        this.repo = repo;
    }

    async getFile(filePath) {
        let url = `https://api.github.com/repos/${this.user}/${this.repo}/contents/${filePath}`
        return new Promise(resolve => {
            axios.get(url, this.config).then(res => {
                resolve([true, res])
            }).catch(err => {
                resolve([false, err])
            })
        })
    }

    async updateFile(filePath, content, message) {
        let url = `https://api.github.com/repos/${this.user}/${this.repo}/contents/${filePath}`
        return new Promise(resolve => {
            axios.get(url, this.config).then(res => {
                axios.put(url, {
                    message: message || `更新${filePath}`,
                    sha: res.data.sha,
                    committer: this.committer,
                    content: btoa(content)
                }, this.config).then(res => {
                    resolve([true, res])
                }).catch(err => {
                    resolve([false, err])
                })
            }).catch(err => {
                resolve([false, err])
            })
        })
    }
}