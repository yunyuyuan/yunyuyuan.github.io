<template>
  <div class="detail">
    <div class="content" flex>
      <aside class="info" :style="{transform: `translateY(${asideTop}px)`}" ref="aside" flex>
        <div :class="{'active': asideActive}">
          <div class="anchors" flex>
            <span class="anchor" v-for="item in anchors" @click="toAnchor(item.el)">{{ item.text }}</span>
          </div>
          <div class="share"></div>
        </div>
        <span class="toggle-aside" :class="{active: asideActive}" @click="asideActive = !asideActive" flex
              :title="`${asideActive?'关闭':'展开'}侧栏`">
          <span class="top"></span>
          <span class="bottom"></span>
        </span>
      </aside>
      <span :class="{'show-aside': asideActive}" ref="markdown" class="--markdown" v-html="html"></span>
    </div>
    <the-comment :info="{id: this.info.file}"/>
  </div>
</template>

<script>
import {getText} from "@/utils";
import {staticFolder} from "@/main";
import {mapState} from "vuex";

import TheComment from "@/views/comment/index";

export default {
  name: "Detail",
  components: {TheComment},
  data() {
    return {
      id: '',
      html: '',
      anchors: [],
      asideActive: true,
      asideTop: 0,
      animationHandle: undefined
    }
  },
  computed: {
    ...mapState(['config']),
    info() {
      if (!this.id) return {};
      for (let i of this.config.md) {
        if (i.file === this.id) {
          return i
        }
      }
    },
    body() {
      return document.querySelector('section.body')
    },
    url() {
      return encodeURI(location.hash.replace(/^#/, ''))
    }
  },
  async created() {
    this.id = this.$route.params.id;
    await this.getHtml();
    document.title = '文章-' + this.info.name;
    this.body.addEventListener('scroll', this.moveAside)
  },
  mounted() {
    // new Valine({
    //   el: this.$el.querySelector('.valine'),
    //   appId: 'lxqgNPckQJMDFguQ6CjVskrg-gzGzoHsz',
    //   appKey: '8WT5Fa6VLrXjkBQP68scqpCf'
    // });
  },
  destroyed() {
    this.body.removeEventListener('scroll', this.moveAside)
  },
  methods: {
    async getHtml() {
      let res = await getText(`${staticFolder}/md/${this.id}/index.html`);
      if (res[0]) {
        this.html = res[1];
        this.$nextTick(() => {
          this.anchors = [];
          this.$refs.markdown.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(e => {
            this.anchors.push({
              el: e,
              text: e.innerText
            });
          })
        })
      } else {
        this.$message.error(`获取文章失败: ${res[1]}`);
      }
    },
    moveAside() {
      if (this.$refs.markdown.scrollHeight - this.body.scrollTop > this.$refs.aside.scrollHeight) {
        this.asideTop = this.body.scrollTop
      }
    },
    toAnchor(el) {
      let markdown = this.$refs.markdown;
      if (el) {
        let fps = 60,
            duration = 1000,
            count = fps * duration / 1000,
            body = this.body;
        let interval = el.getBoundingClientRect().top - markdown.getBoundingClientRect().top + 16,
            scrollNow = body.scrollTop,
            step = (interval - scrollNow) / count;
        if (this.animationHandle) clearInterval(this.animationHandle);
        this.animationHandle = setInterval(() => {
          scrollNow += step;
          count--;
          this.body.scrollTo(0, scrollNow);
          if (count === 0) {
            this.body.scrollTo(0, interval)
            clearInterval(this.animationHandle);
          }
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";
.detail{
  width: 100%;
  min-height: 100%;
  > .content{
    min-width: 50rem;
    max-width: 75rem;
    margin: 1rem auto;
    position: relative;
    justify-content: flex-end;
    > .info{
      position: absolute;
      left: 0;
      top: 0;
      transition: all .1s ease-out;
      align-items: self-start;
      > div{
        max-height: calc(100vh - 11rem);
        &.active > .anchors{
          width: 12rem;
        }
        > .anchors{
          width: 0;
          flex-direction: column;
          background: white;
          border-radius: 0.4rem;
          box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
          transition: all .15s ease-out;
          overflow: hidden;
          > span{
            margin: 0.5rem 0;
            font-size: 0.85rem;
            transition: all .15s linear;
            cursor: pointer;
            @include text-overflow(1);
            &.active{
              font-size: 1.1rem;
            }
          }
        }
        > .share{
        }
      }
      > .toggle-aside {
        background: white;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        position: relative;
        cursor: pointer;

        > span {
          transition: all .2s ease-out;
          position: absolute;
          width: 50%;
          height: 0.25rem;
          background: black;
          border-radius: 0.15rem;
          margin: 0 25%;

          &.top {
            transform: rotate(45deg);
            top: 30%;
          }

          &.bottom {
            transform: rotate(-45deg);
            bottom: 30%;
          }
        }

        &.active {
          > span {
            &.top {
              top: 45%;
            }

            &.bottom {
              bottom: 45%;
            }
          }
        }
      }
    }
    > .--markdown {
      border-radius: 0.6rem;
      box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
      background: white;
      padding: 2rem 1.5rem;
      width: calc(100% - 5rem);
      transition: all .15s ease-out;

      &.show-aside {
        width: calc(100% - 17rem);
      }
    }
  }
  > ::v-deep .comment{
    width: 90%;
    margin: 2rem auto;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    padding: 1rem 0;
  }
}
</style>