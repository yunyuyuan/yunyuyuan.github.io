<template>
  <div class="list" flex>
    <div ref="list" class="items" flex>
      <div class="item" v-for="item in items" :key="item.id" flex>
        <a class="avatar" target="_blank" :href="item.site">
          <img :src="item.avatar"/>
        </a>
        <div flex>
          <div class="body" flex>
            <div class="head" flex>
              <a :href="item.site" target="_blank">{{ item.nick }}</a>
            </div>
            <div class="content">
              <span class="--markdown" v-html="calcMdToHtml(item.content, false)"></span>
            </div>
            <div class="foot">
              <a class="time">{{ calcTime(item.time) }}</a>
              <span class="reply" @click="clickReply(item.id, null)">回复</span>
              <span v-if="login===item.nick||login===siteConfig.owner" class="delete"
                    @click="closeComment(item.id)">删除</span>
              <write-comment v-if="replayId === item.id && replyChild === null" :cancel="true"
                             :init-height="'100px'" :loading="submitting"
                             @cancel="replayId = -1" @submit="replayComment"/>
            </div>
          </div>
          <div v-if="item.children.length" class="children">
            <div v-for="child in item.children">
              <div class="content" flex>
                <a :href="child.site" class="avatar" target="_blank">
                  <img :src="child.avatar"/>
                </a>
                <div>
                  <a :href="child.site" target="_blank">{{ child.nick }}</a>
                  <span class="--markdown" v-html="calcMdToHtml(child.content, true)"></span>
                </div>
              </div>
              <div class="foot">
                <a class="time">{{ calcTime(child.time) }}</a>
                <span class="reply" @click="clickReply(item.id, child)">回复</span>
                <span v-if="login===child.nick||login===siteConfig.owner" class="delete"
                      @click="deleteReply(child.id)">删除</span>
                <write-comment v-if="replayId === item.id && replyChild === child" :cancel="true"
                               :init-height="'100px'"
                               :loading="submitting" @cancel="replayId = -1" @submit="replayComment"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination" flex>
      <span v-for="p in pages" :class="{active: p === pageNow,disabled: p===''}" @click="toPage(p)">
        {{ p }}
        <svg-icon v-if="p===''" :name="'ellipsis'"/>
      </span>
    </div>
  </div>
</template>

<script>
import {
  logError,
  getPageComment,
  createReply,
  close_deleteComment, deleteReply
} from "@/views/comment/utils";
import WriteComment from "@/views/comment/Write";
import dayjs from 'dayjs';
import {parseAjaxError, parseMarkdown} from "@/utils";
import hljs from "highlight.js";
import siteConfig from '@/site-config'

const pagerCount = 8;

export default {
  name: "ListComment",
  components: {WriteComment},
  props: {
    id: {
      type: String,
      default: 0
    },
    login: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      siteConfig,
      count: 0,
      pageNow: 1,
      onePageItemsCount: 10,
      commentStartCursor: null,
      commentStartCursorOld: null,
      replyStartCursor: null,
      items: [],
      replayId: -1,
      replyChild: null,
      submitting: false,
    }
  },
  computed: {
    pages() {
      let i = 1,
          list = [this.pageNow],
          pageCount = Math.ceil(this.count / this.onePageItemsCount);
      while (true) {
        if (list.length < pagerCount && list.length < pageCount) {
          let next = this.pageNow + i;
          if (next > 0 && next <= pageCount) {
            list.push(next)
          }
        } else {
          break
        }
        let newI = i * -1;
        if (i < 0) {
          newI++;
        }
        i = newI;
      }
      list = list.sort((a, b) => {
        return a > b ? 1 : -1
      })
      if (list.length > pagerCount) {
        if (list[1] !== 2) {
          list.splice(0, 1, 1, '')
        }
        if (list[list.length - 2] !== pageCount - 1) {
          list.splice(list.length - 1, 1, '', pageCount)
        }
      }
      return list
    }
  },
  async created() {
    await this.updatePage();
  },
  methods: {
    async updatePage() {
      let res = await getPageComment({
        count: this.onePageItemsCount,
        title: this.id,
        start: this.commentStartCursor,
      });
      if (res[0]) {
        let data = res[1].data.data.search;
        this.count = data.issueCount;
        this.commentStartCursorOld = this.commentStartCursor;
        this.commentStartCursor = data.pageInfo.endCursor;
        this.items = [];
        for (const e of data.nodes) {
          // 子评论
          let children = [];
          e.comments.nodes.forEach(c => {
            children.push({
              id: c.id,
              avatar: c.author.avatarUrl,
              nick: c.author.login,
              site: c.author.url,
              time: c.createdAt,
              content: c.body,
              identity: c.authorAssociation,
            })
          })
          // 主体
          this.items.push({
            id: e.id,
            number: e.number,
            avatar: e.author.avatarUrl,
            nick: e.author.login,
            site: e.author.url,
            time: e.createdAt,
            content: e.body,
            identity: e.authorAssociation,
            children: children,
          });
        }
        this.$nextTick(() => {
          this.$refs.list.querySelectorAll('pre>code:not(.hljs)').forEach(el => {
            el.innerText = el.innerText.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
            hljs.highlightBlock(el);
          })
        })
      }
    },
    calcTime(time) {
      let t = new dayjs(time);
      return t.format(`YYYY-MM-DD HH:mm`)
    },
    calcMdToHtml(text, isReply) {
      text = text.replaceAll('<', '&lt;').replace(/(?<!^|\n)>/g, '&gt;')
      if (isReply) {
        let matcher = text.match(/^@(\S+)([\s\S]*)/);
        if (matcher) {
          text = `<span class="reply">回复<a target="_blank" href="https://gtihub.com/${matcher[1]}">@${matcher[1]}</a></span>` + matcher[2];
        }
      }
      return parseMarkdown(text)
    },
    async toPage(p) {
      if (p !== '') {
        this.pageNow = p;
        await this.updatePage();
      }
    },

    clickReply(o, t) {
      this.replayId = o;
      this.replyChild = t;
    },
    async replayComment(payload) {
      let res = await createReply({
        id: this.replayId,
        body: (this.replyChild ? `@${this.replyChild.nick} ` : '') + payload.text
      });
      if (logError.call(this, res, '回复成功!', '回复失败')) {

      }
    },
    async closeComment(id) {
      let res = await close_deleteComment('close', id);
      if (logError.call(this, res, '删除成功!', '删除失败')) {

      }
    },
    async deleteReply(id) {
      let res = await deleteReply(id);
      if (logError.call(this, res, '删除成功!', '删除失败')) {

      }
    }
  }
}
</script>

<style scoped lang="scss">
.list{
  width: 100%;
  margin: 2rem 0 1rem 0;
  padding-top: 2rem;
  border-top: 2px solid gray;
  flex-direction: column;
  > .items{
    width: 90%;
    flex-direction: column;

    > .item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      align-items: flex-start;

      > .avatar {
        margin: 0.3rem 1rem 0 0;

        > img {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      > div {
        width: calc(100% - 3.4rem);
        flex-direction: column;

        > .body {
          width: 100%;
          flex-direction: column;

          > .head {
            width: 100%;
            justify-content: space-between;
            padding: 0.4rem 0;

            > a {
              font-size: 0.84rem;
              color: black;
              text-decoration: none;
            }
          }
          > .content{
            width: 100%;
            flex-grow: 1;
            padding: 0.4rem 0 0.3rem 0;
            > span{
              font-size: 0.95rem;
              line-height: 1.5rem;
            }
          }
        }
        > .children{
          width: 100%;
          margin-top: 0.6rem;
          border-top: 1px dotted rgba(0, 0, 0, 0.1);
          > div{
            padding-top: 0.3rem;
            margin-top: 0.3rem;
            > .content{
              align-items: flex-start;
              > a{
                margin-right: 0.8rem;
                > img{
                  width: 1.6rem;
                  height: 1.6rem;
                  border-radius: 50%;
                  object-fit: cover;
                }
              }
              > div {
                line-height: 1.5rem;

                > a {
                  margin-right: 0.8rem;
                  font-size: 0.84rem;
                  text-decoration: none;
                  color: #000000;
                }

                > span {
                  width: 100%;
                  font-size: 0.95rem;

                  ::v-deep span.reply {
                    font-size: 0.84rem;

                    > a {
                      text-decoration: none;
                      color: #007bff;
                      margin-left: 0.3rem;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .foot{
        width: 100%;
        color: gray;
        margin-top: 0.6rem;
        > .time{
          font-size: 0.7rem;
          margin-right: 0.6rem;
        }

        > span {
          cursor: pointer;
          font-size: 0.65rem;

          &:hover {
            color: #ff1616;
          }

          &.close {
            margin-left: 0.5rem;
          }

          &.delete {
            margin-left: 0.5rem;
          }
        }

        > .write {
          width: 100%;
        }
      }
    }
  }

  > .pagination {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;

    > span:not(.disabled) {
      cursor: pointer;
      background: #69f6ff;
      border-radius: 0.2rem;
      padding: 0.3rem 0.8rem;
      font-size: 0.9rem;
      margin: 0 0.5rem;
      transition: all .1s linear;
      color: black;

      &:hover {
        color: white;
        background: #005eff;
      }

      &.active {
        color: white;
        background: #424242;
      }
    }

    > span.disabled {
      > svg {
        width: 2.4rem;
        height: 2.4rem;
        margin: 0 0.8rem;
      }
    }
  }
}
</style>
