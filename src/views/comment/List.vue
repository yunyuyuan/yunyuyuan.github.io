<template>
  <div class="list" flex>
    <div class="items" flex>
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
              <span class="time">{{ calcTime(item.time) }}</span>
              <span class="reply" @click="clickReply(item.number, null)">回复</span>
              <write-comment v-if="replayNumber === item.number && replyChild === null" :cancel="true"
                             :init-height="'100px'" :loading="submitting"
                             @cancel="replayNumber = -1" @submit="replayComment"/>
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
                <span class="time">{{ calcTime(child.time) }}</span>
                <span class="reply" @click="clickReply(item.number, child)">回复</span>
                <write-comment v-if="replayNumber === item.number && replyChild === child" :cancel="true"
                               :init-height="'100px'"
                               :loading="submitting" @cancel="replayNumber = -1" @submit="replayComment"/>
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
import {getCommentChildren, getReactions, getPageComment, createReplyComment} from "@/views/comment/utils";
import WriteComment from "@/views/comment/Write";
import dayjs from 'dayjs';
import {parseAjaxError, parseMarkdown} from "@/utils";

const pagerCount = 8;

export default {
  name: "ListComment",
  components: {WriteComment},
  props: {
    id: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      count: 0,
      pageNow: 1,
      onePageItemsCount: 10,
      items: [],
      replayNumber: -1,
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
      let res = await getPageComment(this.pageNow - 1, this.onePageItemsCount, this.id);
      if (res[0]) {
        let data = res[1].data;
        this.count = data.total_count;
        if (!this.count) return;
        this.items = [];
        for (const e of data.items) {
          let children = [];
          let reactions = {};
          this.items.push({
            id: e.id,
            number: e.number,
            avatar: e.user.avatar_url,
            nick: e.user.login,
            site: e.user.html_url,
            time: e.created_at,
            content: e.body,
            identity: e.author_association,
            children: children,
            reactions: reactions
          });
          getReactions('', e.number).then(res => {
            if (res[0]) {
            }
          })
          // 获取子评论
          if (e.comments > 0) {
            getCommentChildren(e.comments_url).then(res => {
              if (res[0]) {
                for (const e of res[1].data) {
                  let reactions = {};
                  children.push({
                    id: e.id,
                    avatar: e.user.avatar_url,
                    nick: e.user.login,
                    site: e.user.html_url,
                    time: e.created_at,
                    content: e.body,
                    identity: e.author_association,
                    reactions: reactions
                  });
                  getReactions('/comments', e.id).then(res => {
                    if (res[0]) {
                    }
                  })
                }
              }
            });
          }
        }
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
          text = `<span class="reply">回复<a target="_blank" href="https://gtihub.com/${matcher[1]}">@${matcher[1]}<a/></span>` + matcher[2];
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
      this.replayNumber = o;
      this.replyChild = t;
    },
    async replayComment(payload) {
      let res = await createReplyComment({
        number: this.replayNumber,
        body: (this.replyChild ? `@${this.replyChild.nick} ` : '') + payload.text
      });
      if (res[0]) {
        this.$message.success('评论成功!');
        await this.updatePage();
      } else {
        this.$message.error(`评论失败 ${parseAjaxError(res[1])}`)
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
                    margin-right: 0.6rem;
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
        > .reply{
          cursor: pointer;
          font-size: 0.65rem;

          &:hover {
            color: #ff1616;
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
