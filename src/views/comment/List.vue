<template>
  <div class="list">
    <div class="items" flex>
      <div class="item" v-for="item in items" :key="item.id">
        <div class="master" flex>
          <a class="avatar" target="_blank" :href="item.site">
            <img :src="item.avatar"/>
          </a>
          <div flex>
            <div class="body" flex>
              <div class="head" flex>
                <a :href="item.site" target="_blank">{{ item.nick }}</a>
                <span>{{ item.time }}</span>
              </div>
              <div class="content">
                <span>{{ item.content }}</span>
              </div>
              <div class="foot">
                <span @click="replayId = item.id">回复</span>
                <write-comment v-if="replayId === item.id" :cancel="true" :init-height="'100px'" :loading="submitting"
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
                    <span>{{ child.content }}</span>
                  </div>
                </div>
                <div class="foot">
                  <span @click="replayId = child.id">回复</span>
                  <write-comment v-if="replayId === child.id" :cancel="true" :init-height="'100px'"
                                 :loading="submitting" @cancel="replayId = -1" @submit="replayComment"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">

    </div>
  </div>
</template>

<script>
import {getCommentChildren, getPageComment} from "@/views/comment/utils";
import WriteComment from "@/views/comment/Write";

export default {
  name: "ListComment",
  components: {WriteComment},
  data() {
    return {
      count: 0,
      pageNow: 1,
      onePageItemsCount: 10,
      items: [],
      replayId: -1,
      submitting: false,
    }
  },
  computed: {
    pages() {

    }
  },
  async created() {
    await this.updatePage();
  },
  methods: {
    async updatePage() {
      let res = await getPageComment(this.pageNow - 1, this.onePageItemsCount, 'title');
      if (res[0]) {
        let data = res[1].data;
        this.count = data.total_count;
        if (!this.count) return;
        this.items = [];
        for (const e of data.items) {
          let children = [];
          this.items.push({
            id: e.id,
            avatar: e.user.avatar_url,
            nick: e.user.login,
            site: e.user.html_url,
            time: e.updated_at,
            content: e.body,
            identity: e.author_association,
            children: children,
          });
          // 获取子评论
          if (e.comments > 0) {
            getCommentChildren(e.comments_url).then(res => {
              if (res[0]) {
                for (const e of res[1].data) {
                  children.push({
                    id: e.id,
                    avatar: e.user.avatar_url,
                    nick: e.user.login,
                    site: e.user.html_url,
                    time: e.updated_at,
                    content: e.body,
                    identity: e.author_association,
                  })
                }
              }
            });
          }
        }
      }
    },
    replayComment(payload) {

    }
  }
}
</script>

<style scoped lang="scss">
.list {
  width: 90%;
  margin: 1rem 0;

  > .items {
    flex-direction: column;

    > .item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;

      > .master {
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
          flex-direction: column;
          flex-grow: 1;

          > .body {
            width: 100%;
            flex-direction: column;

            > .head {
              width: 100%;
              justify-content: space-between;
              padding: 0.4rem 0;

              > a {
                font-size: 0.98rem;
                color: black;
                text-decoration: none;
              }

              > span {
                font-size: 0.7rem;
                margin-right: 0.6rem;
              }
            }

            > .content {
              width: 100%;
              flex-grow: 1;
              padding: 0.8rem 0;

              > span {
                font-size: 0.9rem;
              }
            }

            > .foot {
              width: 100%;

              > span {
                cursor: pointer;
                font-size: 0.85rem;

                &:hover {
                  color: #ff1616;
                }
              }

              > .write {
                width: 100%;
              }
            }
          }

          > .children {
            width: 100%;
            margin-top: 0.6rem;
            border-top: 1px dotted rgba(0, 0, 0, 0.1);

            > div {
              padding: 0.3rem 0;
              margin: 0.3rem 0;

              > .content {
                align-items: flex-start;

                > a {
                  margin-right: 0.8rem;

                  > img {
                    width: 1.6rem;
                    height: 1.6rem;
                    border-radius: 50%;
                    object-fit: cover;
                  }
                }

                > div {
                  line-height: 1.5rem;
                  flex-grow: 1;

                  > a {
                    margin-right: 0.8rem;
                    font-size: 0.94rem;
                    text-decoration: none;
                    color: #0066ff;
                  }

                  > span {
                    cursor: pointer;
                    font-size: 0.9rem;
                  }
                }
              }

              > .foot {
                margin-top: 0.5rem;

                > span {
                  cursor: pointer;
                  font-size: 0.85rem;

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
        }
      }
    }
  }

  > .pagination {

  }
}
</style>