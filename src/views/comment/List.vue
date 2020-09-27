<template>
  <div class="list">
    <div class="items" flex>
      <div class="item" v-for="item in items" :key="item.id">
        <div class="master" flex>
          <a class="avatar" target="_blank" :href="item.site">
            <img :src="item.avatar"/>
          </a>
          <div class="body" flex>
            <div class="head">
              <b>{{ item.nick }}</b>
              <span>{{ item.time }}</span>
            </div>
            <div class="content">
              <span>{{ item.content }}</span>
            </div>
            <div class="foot">
              <span>回复</span>
            </div>
          </div>
        </div>
        <div class="children" v-if="item.children.length">
          <div v-for="child in item.children">
            <div class="content">
              <a class="avatar" target="_blank" :href="child.site">
                <img :src="child.avatar"/>
              </a>
              <b>{{ child.nick }}</b>
              <span>{{ child.content }}</span>
            </div>
            <div class="foot">
              <span>回复</span>
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

export default {
  name: "ListComment",
  data() {
    return {
      count: 0,
      pageNow: 1,
      onePageItemsCount: 10,
      items: [],
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
      border-bottom: 1px solid gray;
      width: 100%;

      > .master {
        > .avatar {
          > img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 1px solid gray;
          }
        }

        > .body {
          flex-grow: 1;
          flex-direction: column;

          > .head {
            width: 100%;

            > b {

            }

            > span {

            }
          }

          > .content {
            width: 100%;
            flex-grow: 1;

            > span {

            }
          }

          > .foot {
            width: 100%;
          }
        }
      }

      > .children {
        > div {
          > .content {
            > a {
              > img {
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 50%;
              }
            }

            > b {

            }

            > span {

            }
          }

          > .foot {

          }
        }
      }
    }
  }

  > .pagination {

  }
}
</style>