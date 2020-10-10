<template>
  <div class="detail">
    <div class="content" flex>
      <aside class="info" :style="{transform: `translateY(${asideTop}px)`}" ref="aside" flex>
        <div :class="{'active': asideActive}" flex>
          <div class="anchors" flex>
            <span class="anchor" :class="{active: item.active}" v-for="item in anchors" @click="toAnchor(item.el)">{{ item.text }}</span>
          </div>
          <div class="share" flex>
            <div class="qr" @mouseenter="loadQr" @mouseleave="showQr = false">
              <span flex>
                <svg-icon :name="'qr'"/>
              </span>
              <div v-show="showQr" flex>
                <div class="load" v-if="!qrcode">
                  <svg-icon :name="'loading'"/>
                </div>
                <img v-else :src="qrcode" alt="qr"/>
              </div>
            </div>
          </div>
        </div>
        <span class="toggle-aside" :class="{active: asideActive}" @click="asideActive = !asideActive" flex
              :title="`${asideActive?'关闭':'展开'}侧栏`">
          <span class="top"></span>
          <span class="bottom"></span>
        </span>
      </aside>
      <span :class="{'show-aside': asideActive}" ref="markdown" class="--markdown" v-html="html"></span>
    </div>
    <the-comment v-if="this.info" :title="this.info.file"/>
  </div>
</template>

<script>
import {getText, hljsAndInsertCopyBtn} from "@/utils";
import {originPrefix} from "@/main";
import {mapState} from "vuex";

import TheComment from "@/views/comment/index";

import qrcode from "qrcode";

export default {
  name: "Detail",
  components: {TheComment},
  data() {
    return {
      id: '',
      html: '',
      anchors: [],
      asideActive: false,
      asideTop: 0,
      animationHandle: undefined,
      qrcode: '',
      showQr: false
    }
  },
  computed: {
    ...mapState(['md']),
    info() {
      if (!this.id) return {};
      for (let i of this.md) {
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
  async mounted() {
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
      let res = await getText(`${originPrefix}/md/${this.id}/index.html`);
      if (res[0]) {
        this.html = res[1];
        this.$nextTick(() => {
          // 取出anchor
          this.anchors = [];
          let headList = this.$refs.markdown.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
          headList.forEach(el => {
            this.anchors.push({
              el: el,
              text: el.innerText,
              active: false
            });
            el.onclick = () => {
              this.toAnchor(el)
            };
            let before = document.createElement('img');
            before.src = `${originPrefix}/favicon.svg`;
            before.alt = 'anchor';
            el.appendChild(before);
          })
          // 监听滚动
          this.body.onscroll = ()=>{
            let last = {};
            for (let el of headList){
              if (last && el.getBoundingClientRect().top > document.querySelector('section.the-head').scrollHeight){
                break
              }
              last = el;
            }
            this.anchors.forEach(a=>{
              a.active = a.text === last.innerText;
            })
          }
          // hljs
          this.$refs.markdown.querySelectorAll('pre>code').forEach(el => {
            hljsAndInsertCopyBtn(el);
          });
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
    loadQr() {
      this.showQr = true
      if (!this.qrcode) {
        qrcode.toDataURL(location.href, (err, url) => {
          this.qrcode = url
        })
      }
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
      z-index: 1;
      > div{
        max-height: calc(100vh - 11rem);
        flex-direction: column;
        &.active > .anchors{
          width: 12rem;
        }
        &.active .share{
          overflow: unset;
          width: 6rem;
        }
        > .anchors, > .share{
          width: 0;
          flex-direction: column;
          background: white;
          border-radius: 0.4rem;
          box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
          transition: all .15s ease-out;
          overflow: hidden;
        }
        > .anchors{
          padding: 0.6rem 0;
          > span{
            margin: 0.4rem 0;
            font-size: 0.85rem;
            transition: all .15s linear;
            cursor: pointer;
            @include text-overflow(1);
            &.active{
              transform: scale(1.2);
              font-weight: bold;
              color: red;
            }
          }
        }
        > .share{
          margin-top: 1rem;
          padding: 1rem 0;
          > .qr{
            position: relative;
            > span{
              cursor: pointer;
              > svg{
                width: 2rem;
                height: 2rem;
              }
            }
            > div{
              position: absolute;
              right: 0;
              top: 0;
              transform: translateX(calc(100% + 1rem));
              border-radius: 0.3rem;
              border: 1px solid #d2d2d2;
              box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.6);
              > .load{
                padding: 1rem;
                background: white;
                border-radius: inherit;
                > svg{
                  width: 3rem;
                  height: 3rem;
                }
              }
              > img{
                width: 10rem;
                height: 10rem;
                border-radius: inherit;
              }
            }
          }
        }
      }
      > .toggle-aside {
        background: white;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        position: relative;
        cursor: pointer;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);

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
    > .--markdown{
      border-radius: 0.6rem;
      box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
      background: white;
      padding: 2rem 1rem 2rem 2.8rem;
      width: calc(100% - 5.8rem);
      transition: all .15s ease-out;
      &.show-aside{
        width: calc(100% - 17.8rem);
      }

      @each $size in 1, 2, 3, 4, 5, 6 {
        ::v-deep h#{$size} {
          position: relative;
          cursor: pointer;
          height: 1.5+1.2rem*1/$size;
          display: flex;
          align-items: center;

          img {
            position: absolute;
            left: 0;
            transform: translateX(calc(-100% - 0.5rem));
            width: 1+1.2rem/$size;
            height: 1+1.2rem/$size;
            object-fit: contain;
          }
        }
      }
    }
  }
  > ::v-deep .comment{
    width: 90%;
    max-width: 60rem;
    margin: 2rem auto;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    padding: 1rem 0;
  }
  @include media{
    >.content{
      min-width: 100%;
      max-width: 100%;
      >.info{

      }
      >.--markdown{
        width: 100% !important;
      }
    }
    > ::v-deep .comment{
      width: 98%;
      max-width: unset;
      >.write{
        width: 95%;
      }
    }
  }
}
</style>