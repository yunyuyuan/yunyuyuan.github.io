import axios from "axios";

export async function getConfig() {
    return new Promise(resolve => {
        fetch('/config.json').then(res => {
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

// github
export class githubUtils {
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