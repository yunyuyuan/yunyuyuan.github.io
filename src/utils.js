import axios from "axios";
import Octokat from 'octokat';

const showdown = require('showdown');
const converter = new showdown.Converter({
    prefixHeaderId: '__markdown_header_id_',
    tables: true,
    tasklists: true,
    backslashEscapesHTMLTags: true,
    parseImgDimensions: true
});

// 直接从站点上获取文件text
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

export function parseMarkdown(text) {
    text = text
        // target=_blank
        .replace(/#\[(.*?)]\((.*?)\)/g, '<a target="_blank" href="$2">$1</a>')
        // sticker
        .replace(/!\[sticker]\((aru|yellow-face)\/(\d+)\)/, '<img alt="sticker" src="/sticker/$1/$2.png"/>');
    return converter.makeHtml(text)
}

export function parseAjaxError(err) {
    if (err.response) {
        let status = err.response.status;
        switch (status) {
            case 401:
                return "错误: 未授权,请检查token是否正确";
            case 404:
                return "错误: 不存在那个文件";
            default:
                return `错误码: ${status}`
        }
    }
    switch (err.message) {
        case "Network Error":
            return `网络错误 :${err}，请检查网络连接`;
        default:
            return `未知错误 :${err}`;
    }
}

export function stringToB64(s) {
    return btoa(unescape(encodeURIComponent(s)))
}

// github
export class GithubUtils {
    constructor(token, user, repo, committer) {
        this.octo = new Octokat({
            token: token,
            username: user,
        });
        this.repos = this.octo.repos(user, repo);
        this.committer = committer
    }

    async updateConfig(content) {
        return new Promise(resolve => {
            this.repos.contents('public/config.json').fetch().then(res => {
                return this.repos.contents('public/config.json').add({
                    message: '更新config.json',
                    content: content,
                    sha: res.sha,
                    committer: this.committer
                }).then(res => {
                    resolve([true, res])
                }).catch(err => {
                    resolve([false, err])
                })
            }).catch(err => {
                resolve([false, err])
            })
        })
    }

    async updateMd(payload) {
        return new Promise(async resolve => {
            let main = await this.repos.git.refs('heads/master').fetch().catch(err => {
                resolve([false, err])
            });

            // 创建tree
            const files = [
                {
                    file: 'index.md',
                    content: payload.md
                },
                {
                    file: 'index.html',
                    content: payload.html
                }
            ];
            let treeItems = [];
            for (let item of files) {
                if (!item.file) continue;
                let res = await this.repos.git.blobs.create({content: item.content, encoding: 'utf-8'}).catch(err => {
                    resolve([false, err])
                });
                treeItems.push({
                    path: `public/md/${payload.folder}/${item.file}`,
                    sha: res.sha,
                    mode: "100644",
                    type: "blob"
                });
            }
            let tree = await this.repos.git.trees.create({
                tree: treeItems,
                base_tree: main.object.sha
            }).catch(err => {
                resolve([false, err])
            });

            // commit
            let commit = await this.repos.git.commits.create({
                message: `更新 md-${payload.folder}`,
                tree: tree.sha,
                parents: [main.object.sha]
            }).catch(err => {
                resolve([false, err])
            });
            await main.update({sha: commit.sha}).catch(err => {
                resolve([false, err])
            });
            resolve([tree])
        })
    };


    async removeMd(folder) {
        return new Promise(async resolve => {
            for (let i of ['index.md', 'index.html']) {
                let res = await this.repos.git.blobs(`public/md/${folder}/${i}`).read().catch(err => {
                    resolve([false, err])
                });
                await this.repos.contents(`public/md/${folder}/${i}`).remove({
                    sha: res.sha,
                    message: '删除'
                }).catch(err => {
                    resolve([false, err])
                });
            }
            resolve([true])
        })
    }
}