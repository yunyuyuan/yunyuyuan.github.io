<template>
  <div class="list" flex>
    <div class="empty" v-if="items.length===0">
      <span>无人问津<svg-icon :name="'grass'"/>暂无评论</span>
    </div>
    <div class="items" flex v-else>
      <div v-if="loading" class="loading" flex>
        <svg-icon :name="'loading'"/>
      </div>
      <div v-else class="item" v-for="item in items" :key="item.id" flex>
        <a class="avatar" target="_blank" :href="item.site">
          <img :src="item.avatar" alt="avatar"/>
        </a>
        <div flex>
          <div class="body" flex>
            <div class="head" flex>
              <span class="nick-name" :class="{owner: item.nick===siteConfig.owner,self: item.nick===login}" flex>
                <a :href="item.site" target="_blank">{{ item.nick }}</a>
                <span title="大boss" v-if="item.nick===siteConfig.owner"><svg-icon :name="'cmt-owner'"/></span>
                <span title="我自己" v-if="item.nick===login"><svg-icon :name="'cmt-self'"/></span>
              </span>
            </div>
            <div class="content">
              <span class="--markdown" v-html="calcMdToHtml(item.content, false)" v-viewer></span>
            </div>
            <div class="foot" flex>
              <a class="time">{{ item.time | time(false) }}</a>
              <span class="reply" @click="clickReply(item, null)">回复</span>
              <span v-if="login===item.nick||login===siteConfig.owner" class="delete"
                    @click="closeComment(item.id)">删除</span>
              <span v-for="emoji in ['+1','-1']" class="react" :down="emoji==='-1'" :class="{active: item.reactions[emoji].has}" :title="emoji" @click="doReact(emoji, item, item.reactions[emoji].has)" flex>
                <svg-icon :name="'thumb'"/>
                <span v-if="item.reactions[emoji].count>0">{{item.reactions[emoji].count}}</span>
              </span>
              <write-comment v-if="replayItem === item && replyChild === null" :cancel="true"
                             :init-height="'100px'" :loading="submitting"
                             @cancel="replayItem = null" @submit="replayComment"/>
            </div>
          </div>
          <div class="loading" v-if="item.loading" flex>
            <svg-icon :name="'loading'"/>
          </div>
          <div v-else-if="item.children.length" class="children">
            <div v-for="child in item.children" :key="child.id" class="child">
              <div class="content" flex>
                <a :href="child.site" class="avatar" target="_blank">
                  <img :src="child.avatar" alt="avatar"/>
                </a>
                <div flex>
                  <div class="text">
                    <span class="nick-name" :class="{owner: child.nick===siteConfig.owner,self: child.nick===login}" flex>
                      <a :href="item.site" target="_blank">{{ child.nick }}</a>
                      <span title="大boss" v-if="child.nick===siteConfig.owner"><svg-icon :name="'cmt-owner'"/></span>
                      <span title="我自己" v-if="child.nick===login"><svg-icon :name="'cmt-self'"/></span>
                    </span>
                    <span class="--markdown" v-html="calcMdToHtml(child.content, true)" v-viewer></span>
                  </div>
                  <div class="foot" flex>
                    <a class="time">{{ child.time | time(false) }}</a>
                    <span class="reply" @click="clickReply(item, child)">回复</span>
                    <span v-if="login===child.nick||login===siteConfig.owner" class="delete"
                          @click="deleteReply(child.id, item)">删除</span>
                    <span v-for="emoji in ['+1','-1']" class="react" :down="emoji==='-1'" :class="{active: child.reactions[emoji].has}" :title="emoji" @click="doReact(emoji, child, child.reactions[emoji].has)" flex>
                      <svg-icon :name="'thumb'"/>
                      <span v-if="child.reactions[emoji].count>0">{{child.reactions[emoji].count}}</span>
                    </span>
                    <write-comment v-if="replayItem === item && replyChild === child" :cancel="true"
                                   :init-height="'100px'"
                                   :loading="submitting" @cancel="replayItem = null" @submit="replayComment"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="page" v-if="item.page.hasPreviousPage||item.page.hasNextPage" flex>
              <span :disabled="!item.page.hasPreviousPage" class="left" flex
                    @click='toReply(!item.page.hasPreviousPage, item, `,before: "${item.page.startCursor}"`)'><svg-icon
                  :name="'right'"/></span>
              <span :disabled="!item.page.hasNextPage" class="right" flex
                    @click='toReply(!item.page.hasNextPage, item, `,after: "${item.page.endCursor}"`)'><svg-icon
                  :name="'right'"/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination @turn="turnCommentPage" :item-count="itemCount" :page-now="pageNow" :per-count="onePageItemsCount"/>
  </div>
</template>

<script>
import {
  logError,
  getPageComment,
  createReply,
  closeOrDeleteComment, deleteReply, getCommentChildren, getReactions, doReaction
} from "@/views/comment/utils";
import WriteComment from "@/views/comment/Write";
import {parseAjaxError} from "@/utils/utils";
const siteConfig = require( '@/site-config')
import Pagination from "@/components/Pagination";
import {parseMarkdown, processMdHtml} from "@/utils/parseMd";
import {hljsAndInsertCopyBtn} from "@/utils/highlight";

export default {
  name: "ListComment",
  components: {Pagination, WriteComment},
  props: {
    title: {
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
      onePageItemsCount: 8,
      pageInfo: {},
      pageNow: 1,
      itemCount: 0,
      items: [],
      replayItem: null,
      replyChild: null,
      submitting: false,
      updating: false,
      loading: false,
    }
  },
  async mounted() {
    await this.updatePage();
  },
  methods: {
    async updatePage(cursor) {
      this.loading = true;
      let res = await getPageComment({
        count: this.onePageItemsCount,
        title: this.title,
        cursor: cursor
      });
      if (res[0]) {
        let data = res[1].data.data.search;
        this.itemCount = data.issueCount;
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
              reactions: getReactions(c.reactionGroups)
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
            loading: false,
            page: e.comments.pageInfo,
            reactions: getReactions(e.reactionGroups)
          });
        }
      } else {
        this.$message.error(parseAjaxError(res[1]))
      }
      this.loading = false;
      this.parseHtml();
    },
    calcMdToHtml(text, isReply) {
      text = text.replace(/</g, '&lt;').replace(/(^|\s*)>/g, '$1&gt;');
      const html = parseMarkdown(text.replace(/^@\w+ ([\s\S]*)$/, '$1'));
      let reply = '';
      if (isReply) {
        let matcher = text.match(/^@(\w+) /);
        if (matcher) {
          reply = `<span class="reply">回复<a class="nick-name" target="_blank" href="https://gtihub.com/${matcher[1]}">@${matcher[1]}</a>:</span>`;
        }
      }
      return reply+html
    },
    parseHtml (){
      this.$nextTick(()=>{
        this.$el.querySelectorAll('span.--markdown:not([parsed])').forEach(el=>{
          el.setAttribute('parsed', '');
          el.querySelectorAll('pre>code:not(.hljs)').forEach(el => {
            el.innerText = el.innerText.replace(/&lt;/g, '<').replaceAll('&gt;', '>');
            hljsAndInsertCopyBtn(el);
          })
          processMdHtml(el, true)
        })
      })
    },
    async turnCommentPage(p) {
      if (this.updating) return;
      this.updating = true;
      await this.updatePage(`,after: "${btoa(`cursor:${(p-1)*this.onePageItemsCount}`)}"`);
      this.pageNow = p;
      this.updating = false
    },
    async toReply(cant, item, cursor) {
      if (cant) return
      if (this.updating) return;
      this.updating = true;
      item.loading = true;
      let res = await getCommentChildren({
        id: item.id,
        count: this.onePageItemsCount,
        cursor: cursor
      });
      if (res[0]) {
        let data = res[1].data.data.node.comments;
        item.page = data.pageInfo;
        item.children = [];
        data.nodes.forEach(c => {
          item.children.push({
            id: c.id,
            avatar: c.author.avatarUrl,
            nick: c.author.login,
            site: c.author.url,
            time: c.createdAt,
            content: c.body,
            identity: c.authorAssociation,
            reactions: getReactions(c.reactionGroups)
          })
        })
      }
      item.loading = false;
      this.updating = false
      this.parseHtml();
    },

    clickReply(o, t) {
      this.replayItem = o;
      this.replyChild = t;
    },
    async replayComment(payload) {
      this.submitting = true;
      let res = await createReply({
        id: this.replayItem.id,
        body: (this.replyChild ? `@${this.replyChild.nick} ` : '') + payload.text
      });
      if (logError.call(this, res, '回复成功!', '回复失败')) {
        await this.toReply(false, this.replayItem)
        this.replayItem = null;
        this.replyChild = null;
      }
      this.submitting = false;
    },
    async closeComment(id) {
      if (!confirm('确认删除?')) return;
      let res = await closeOrDeleteComment('close', id);
      if (logError.call(this, res, '删除成功!', '删除失败')) {
        setTimeout(async () => {
          await this.updatePage()
        }, 1000)
      }
    },
    async deleteReply(id, item) {
      if (!confirm('确认删除?')) return;
      let res = await deleteReply(id);
      if (logError.call(this, res, '删除成功!', '删除失败')) {
          await this.toReply(false, item)
      }
    },
    doReact : (()=> {
      let doing = false;
      return async function (emoji, item, has) {
        if (doing) return;
        doing = true;
        item.reactions[emoji] = {
          has: !has,
          count: item.reactions[emoji].count + (has ? -1 : 1)
        };
        let res = await doReaction({
          content: `THUMBS_${emoji === '-1' ? 'DOWN' : 'UP'}`,
          id: item.id,
          has: has
        });
        if (!res[0] || res[1].data.errors) {
          item.reactions[emoji] = {
            has: has,
            count: item.reactions[emoji].count + (has ? 1 : -1)
          };
          this.$message.error('出错了:' + (res[0] ? res[1].data.errors[0].message : parseAjaxError(res[1])))
        }
        doing = false;
      }
    })()
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
  .loading{
    width: 100%;
    margin: 2rem 0;
    justify-content: center;
    >svg{
      width: 5rem;
      height: 5rem;
    }
  }
  >.empty{
    font-size: 0.95rem;
    >span{
      > svg{
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 1rem;
      }
    }
  }
  > .items{
    width: 90%;
    flex-direction: column;

    > .item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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
          transition: all .1s linear;
          &:hover{
            transform: scale(1.1);
          }
        }
      }

      > div {
        width: calc(100% - 3.4rem);
        flex-direction: column;

        > .body {
          width: 100%;
          flex-direction: column;
          &:hover{
            >.foot{
              color: black;
            }
            ~.children{
              border-color: #ff2525;
            }
          }

          > .head {
            width: 100%;
            justify-content: space-between;
            padding: 0.2rem 0 0.6rem 0;

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
          border-top: 1px solid rgba(0, 0, 0, 0.3);

          > .child {
            padding-top: 0.3rem;
            margin-top: 0.8rem;
            &:hover{
              >.content >div{
                >.text{
                  border-color: #005eff;
                }
                >.foot {
                  color: black;
                }
              }
            }

            > .content {
              align-items: flex-start;

              > a {
                margin-right: 0.5rem;

                > img {
                  width: 1.8rem;
                  height: 1.8rem;
                  border-radius: 50%;
                  object-fit: cover;
                  transition: all .1s linear;
                  &:hover{
                    transform: scale(1.1);
                  }
                }
              }
              >div {
                flex-direction: column;
                width: 100%;
                > .text {
                  line-height: 1.5rem;
                  width: calc(100% - 0.5rem + 1px);
                  border-left: 1px dashed rgba(0, 0, 0, 0.2);
                  padding-left: 0.5rem;

                  > a {
                    margin-right: 0.8rem;
                  }

                  > span {
                    width: 100%;
                    font-size: 0.95rem;

                    ::v-deep span.reply {
                      font-size: 0.84rem;

                      > a {
                        margin-left: 0.3rem;
                      }
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
        transition: all .1s linear;
        flex-wrap: wrap;
        > .time{
          font-size: 0.7rem;
          margin-right: 0.6rem;
        }

        > span {
          cursor: pointer;
          font-size: 0.65rem;

          &:hover {
            color: #ff1616;
            >svg{
              fill: red !important;
            }
            >span{
              color: red !important;
            }
          }
          &.react{
            margin-left: 1rem;
            &[down]{
              >svg{
                transform: rotate(180deg);
              }
            }
            &.active{
              >svg{
                fill: #ff3c00;
              }
              >span{
                color: #ff3c00;
              }
            }
            >svg{
              width: .95rem;
              height: .95rem;
            }
            >span{
              font-size: 0.85rem;
              margin-left: 0.3rem;
            }
          }

          &.close {
            margin-left: 0.5rem;
          }

          &.delete {
            margin-left: 0.5rem;
          }
        }

        @keyframes toggle-down-write {
          0%{
            height: 0;
          }
          100%{
            height: 10rem;
          }
        }
        > .write{
          width: 100%;
          height: 0;
          animation: toggle-down-write .5s ease-out forwards;
        }
      }
    }
  }
  span.nick-name{
    > a{
      font-size: 1rem;
      color: #3d3d3d;
      text-decoration: none;
      font-weight: bold;
      margin-right: 1rem;
      &:hover{
        color: blue;
        text-decoration: underline;
      }
    }
    > span{
      width: 1.4rem;
      height: 1.4rem;
      margin-right: 0.6rem;
      &:hover{
        >svg{
          transform: scale(1.2);
        }
      }
      >svg{
        transition: all .15s linear;
        width: 100%;
        height: 100%;
      }
    }
  }
  .page{
    margin-top: 0.5rem;

    > span{
      margin: 0 0.5rem;
      padding: 0.15rem;
      border-radius: 0.15rem;
      justify-content: center;
      cursor: not-allowed;

      &:not([disabled]){
        cursor: pointer;

        &:hover{
          background: rgba(0, 0, 0, 0.15);
        }
      }

      &[disabled]{
        > svg{
          fill: gray
        }
      }

      > svg{
        width: 1rem;
        height: 1rem;
      }

      &.left{
        transform: rotate(180deg);
      }
    }
  }
}
</style>
