import axios from 'axios';
import siteConfig from '@/site-config';
import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';
import {parseAjaxError} from "@/utils";

let owner = siteConfig.owner,
    //  owner = 'vuejs',
    //  repo = `vue`,
    repo = `${owner}.github.io`,
    repoId = '',
    // this token just can read public information
    publicToken = 'token ' + (['5', '742fff2313f3a2a159c3f41394b7502d0a8664b'].join('')),
    headers = {
        Authorization: publicToken
    },
    http = function (payload) {
        return new Promise(resolve => {
            axios({
                url: 'https://api.github.com/graphql',
                method: 'post',
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
    };

export const logError = function (res, suc, err) {
    if (res[0]) {
        if (res[1].data.errors) {
            this.$message.error(`${err} ${res[1].data.errors[0].message}`)
            return false
        } else {
            this.$message.success(suc);
            return true
        }
    } else {
        this.$message.error(`${err} ${parseAjaxError(res[1])}`)
        return false
    }
}

// ======================== methods ============================

export async function getRepoId() {
    let res = await http({
        data: {
            query:
                `query {
  repository(name: "${repo}", owner: "${owner}") {
    id
  }
}
`
        }
    });
    if (res[0]) {
        repoId = res[1].data.data.repository.id;
    }
}

export async function getLoginInfo(token) {
    headers.Authorization = `token ${token}`;
    let res = await http({
        data: {
            query:
                `query {
    viewer {
        login,
        avatarUrl,
        url
    }
}`
        }
    })
    if (res[0]) {
        headers.Authorization = publicToken;
    }
    return res;
}

export function removeToken() {
    headers.Authorization = ''
}

export async function getPageComment(payload) {
    return await http({
        data: {
            query:
                `{
  search(query: "${payload.title}+in:title repo:${owner}/${repo} is:open", type: ISSUE, first: ${payload.count}${payload.start ? `, after: "${payload.start}"` : ''}) {
    issueCount
    nodes {
      ... on Issue {
        author {
          avatarUrl
          login
          url
        }
        body
        number
        createdAt
        id
        authorAssociation
        comments(first: 100) {
          totalCount
          nodes {
            author {
              avatarUrl
              login
              url
            }
            authorAssociation
            body
            createdAt
            id
          }
          pageInfo {
            endCursor
            startCursor
          }
        }
      }
    }
    pageInfo {
      endCursor
      startCursor
    }
  }
}`
        }
    })
}

export async function getCommentChildren(url) {
    return await http({
        data: {
            query:
                `query {
                    viewer {
                        login,
                        avatarUrl,
                        url
                    }
                }`
        }
    })
}

export async function getReactions(type, number) {
    return await http({
        data: {
            query:
                `query {
                    viewer {
                        login,
                        avatarUrl,
                        url
                    }
                }`
        }
    })
}

export async function createComment(payload) {
    return await http({
        data: {
            query:
                `mutation {
  createIssue(input: {repositoryId: "${repoId}", title: "${payload.title}", body: "${payload.body}"}) {
    issue {
      id
    }
  }
}`
        }
    })
}

export async function close_deleteComment(type, id) {
    return await http({
        data: {
            query:
                `mutation {
  ${type}Issue(input: {issueId: "${id}"}) {
    clientMutationId
  }
}
`
        }
    })
}

export async function createReply(payload) {
    return await http({
        data: {
            query:
                `mutation {
  addComment(input: {body: "${payload.body}", subjectId: "${payload.id}"}) {
    clientMutationId
  }
}
`
        }
    })
}

export async function deleteReply(id) {
    return await http({
        data: {
            query:
                `mutation {
  deleteIssueComment(input: {id: "${id}"}) {
    clientMutationId
  }
}
`
        }
    })
}