<template>
  <div class="detail">
    <div class="content" flex>
      <aside class="info" :style="{transform: `translateY(${asideTop}px)`}" flex>
        <div :class="{'active': asideActive}">
          <div class="anchors" flex>
            <span class="anchor" v-for="item in anchors">{{ item }}</span>
          </div>
          <div class="share"></div>
        </div>
        <span class="toggle-aside" @click="asideActive = !asideActive">
          {{ asideActive ? '关' : '开' }}
        </span>
      </aside>
      <span :class="{'show-aside': asideActive}" ref="markdown" class="--markdown" v-html="html"></span>
    </div>
  </div>
</template>

<script>
import {getText} from "@/utils";
import {staticFolder} from "@/main";
import {mapState} from "vuex";

export default {
  name: "Detail",
  data() {
    return {
      id: '',
      html: '',
      anchors: [],
      asideActive: true,
      asideTop: 0,
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
    }
  },
  async created() {
    this.id = this.$route.params.id;
    await this.getHtml();
    document.title = '文章-' + this.info.name;
    this.body.addEventListener('scroll', this.moveAside)
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
            this.anchors.push(e.innerText);
          })
        })
      } else {
        this.$message.error(`获取文章失败: ${res[1]}`);
      }
    },
    moveAside() {
      this.asideTop = this.body.scrollTop
    }
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
      > .toggle-aside{
        background: white;
        padding: 1rem;
      }
    }
    > .--markdown{
      border-radius: 0.6rem;
      box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
      background: white;
      padding: 2rem 1.5rem;
      width: calc(100% - 6rem);
      transition: all .15s ease-out;
      &.show-aside{
        width: calc(100% - 18rem);
      }
    }
  }
}
</style>