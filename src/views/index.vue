<template>
  <div id="index">
    <loading/>
    <NotFound v-if="routeNow===null"/>
    <img class="bg" v-else-if="isBgImg" :src="images[routeNow]" alt="bg"/>
    <div class="bg" v-else>
      <div id="particles-bg"></div>
      <div id="comet-bg">
        <div class="comet" v-for="i in randLen" :style="{left: `${50-Math.random()*100}px`,top: `${10+Math.random()*80}%`,animationDelay: `${Math.random()*5}s`,animationDuration: `${3+Math.random()*4}s`}"></div>
      </div>
    </div>
    <the-head :class="{'show-bg': showBg}" v-if="showHead" @toggle="toggleShowBg"/>
    <section :class="{body: true, 'show-head': showHead, 'show-bg': showBg, 'mask-bg': config.backgroundImg}" flex>
      <component :is="comp" @updateConfig="updateConfig"/>
      <the-footer v-if="this.routeNow !== 'backend'"/>
    </section>
    <message ref="message"/>
  </div>
</template>

<script>
import HomeImage from '@/image/home.jpg';
import ArticleImage from '@/image/article.jpg';
import ArticleDetailImage from '@/image/articleDetail.jpg';
import msgBoardImage from '@/image/msgBoard.jpg';
import recordImage from '@/image/record.jpg';
import aboutImage from '@/image/about.jpg';

import TheHead from "@/views/block/Head";
import TheFooter from "@/views/block/Footer";
import Message from "./block/Message";
import Loading from "@/views/block/Loading";
import NotFound from '@/views/404/index'
import Viewer from 'v-viewer'

import Vue from 'vue';
import {routeInfo} from "@/route";
import {getText, parseAjaxError} from "@/utils/utils";
import {originPrefix} from "@/need";

Vue.use(Viewer)

Viewer.setDefaults({
  filter(img) {
    return img.hasAttribute('data-viewer')
  }
})

export default {
  name: "index",
  components: {Loading, Message, TheHead, TheFooter, NotFound},
  data() {
    return {
      config: {
          name: "",
          describe: "",
          copyright: "",
          github: "",
          bilibili: "",
          email: "",
          sticker: [],
          backgroundImg: "random",
          friends: []
      },
      comp: null,

      showHead: true,
      showBg: false,
      bgColor: '',
      images: {
        home: HomeImage,
        article: ArticleImage,
        articleDetail: ArticleDetailImage,
        msgBoard: msgBoardImage,
        backend: HomeImage,
        record: recordImage,
        about: aboutImage,
      },
      routeNow: 'home',
    }
  },
  provide() {
    return {
      _config: () => this.computeConfig,
    }
  },
  computed: {
    isBgImg() {
      return this.config.backgroundImg === 'img' || (this.config.backgroundImg === 'random' && this.rand)
    },
    rand() {
      return Math.floor(Math.random()*10)%2===0
    },
    computeConfig() {
      return this.config
    },
    randLen (){
      return 3+Math.floor(Math.random()*4)
    }
  },
  async created() {
    const route = routeInfo();
    document.title = route.title;
    document.head.querySelector('meta[name=keywords]').setAttribute('content', route.keywords);
    document.head.querySelector('meta[name=description]').setAttribute('description', route.keywords);

    this.showHead = route.name !== 'backend';
    this.routeNow = route.name;
    this.comp = route.comp || (() => import('@/views/404/index'));

    if (['articleDetail', 'msgBoard', 'backend'].indexOf(route.name) !== -1) {
      // 加载markdown.css
      fetch(`${originPrefix}/markdown.css?ran=${new Date().getTime()}`).then(res => {
        res.text().then(text => {
          document.head.querySelector('#markdown-stylesheet').innerHTML = text;
        })
      })
    }
  },
  async mounted() {
    Vue.prototype.$message = this.$refs.message;
    await this.updateConfig();
    this.$nextTick(() => {
      if (!this.isBgImg) {
        //particle
        const tsparticles = () => import('tsparticles');
        tsparticles().then(({particlesJS}) => {
          particlesJS('particles-bg', {
            particles: {
              number: {value: 100, density: {enable: true, value_area: 800}},
              color: {value: "#ffffff"},
              shape: {
                type: "circle",
                stroke: {width: 0, color: "#000000"},
                polygon: {nb_sides: 5},
              },
              opacity: {
                value: 1,
                random: true,
                anim: {enable: true, speed: 1, opacity_min: 0, sync: false}
              },
              size: {
                value: 3,
                random: true,
                anim: {enable: false, speed: 4, size_min: 0.3, sync: false}
              },
              move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {enable: false, rotateX: 600, rotateY: 600}
              }
            },
            retina_detect: true
          });
        })
      }
    })
  },
  methods: {
    toggleShowBg(b) {
      this.showBg = b
    },
    async updateConfig(config) {
      if (config) {
        this.config = config
      } else {
        // 获取config
        let res = await getText(`${originPrefix}/json/config.json`);
        if (res[0]) {
          this.config = JSON.parse(res[1])
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";
#index{
  height: 100%;
  width: 100%;
  position: relative;
  > .bg{
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: $z-index-bg;
    overflow: hidden;
    @at-root #particles-bg{
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #16161e, #3a2e49);
    }
    @at-root #comet-bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: block;
      transform: rotateZ(45deg);
      transform-origin: center center;
      > .comet{
        position: absolute;
        height: 2px;
        background: linear-gradient(-45deg, rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
        border-radius: 999px;
        filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
        animation-name: tail, shooting;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        &:before, &:after{
          content: '';
          position: absolute;
          top: calc(50% - 1px);
          right: 0;
          // width: 30px;
          height: 2px;
          background: linear-gradient(-45deg, rgba(0, 0, 255, 0), rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
          transform: translateX(50%) rotateZ(45deg);
          border-radius: 100%;
          animation-name: shining;
          animation-timing-function: inherit;
          animation-iteration-count: infinite;
          animation-duration: inherit;
          animation-delay: inherit;
        }
        &:after{
          transform: translateX(50%) rotateZ(-45deg);
        }
      }
      @keyframes tail{
        0%{
          width: 0;
        }
        30%{
          width: 100px;
        }
        100%{
          width: 0;
        }
      }

      @keyframes shining{
        0%{
          width: 0;
        }
        50%{
          width: 30px;
        }
        100%{
          width: 0;
        }
      }

      @keyframes shooting{
        0%{
          transform: translateX(0);
        }
        100%{
          transform: translateX(100vmax);
        }
      }

      @keyframes sky{
        0%{
          transform: rotate(45deg);
        }
        100%{
          transform: rotate(45 + 360deg);
        }
      }
    }
  }
  > .body{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: $z-index-body;
    flex-direction: column;
    transition: opacity .2s linear;
    opacity: 1;
    &.show-bg{
      opacity: 0;
    }
    &.show-head{
      padding-top: $head-height;
      height: calc(100% - #{$head-height});
    }
    &.mask-bg{
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<style lang="scss">
@import "src/assets/style/public";
html, body{
  width: 100%;
  height: 100%;
  font-size: 16px;
  @include media{
    font-size: 14px;
  }
  &[unselectable]{
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    -ms-user-select: none;
  }
}
*{
  margin: 0;
  padding: 0;
}
*[flex]{
  display: flex;
  align-items: center;
}
*[is-dialog]{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index-dialog;
  background: rgba(0, 0, 0, 0.4);
  justify-content: space-around;
  &, > .inner{
    display: flex;
    align-items: center;
  }
  > .inner{
    background: white;
    border-radius: 1rem;
    flex-direction: column;
    box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.4);
    border: 1px solid #939393;
  }
}
*[write-font]{
  font-family: "write-font", serif;
}
*[data-viewer]{
  cursor: zoom-in;
}
input, textarea, select, button{
  outline: none;
  resize: none;
  font-family: "Source Code Pro", serif;
}
table{
  border-collapse: collapse;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
  tr{
    td{
    }
  }
  thead{
    background: #2b2b2b;
    border-bottom: 2px solid #9f9f9f;
    td, th{
      padding: 0.5rem 0;
      color: white;
      font-size: 1.06rem;
      text-align: center;
      &:not(:last-of-type){
        border-right: 1px solid #d2d2d2;
      }
    }
  }
  tbody{
    tr{
      &:not(:last-of-type){
        border-bottom: 1px solid #d2d2d2;
      }
      background: white;
      transition: all .1s linear;
      &:nth-child(even){
        background: #f5f5f5;
      }
      &:hover{
        background: #ebfffc;
      }
      td{
        padding: 0.4rem 0;
        &:not(:last-of-type){
          border-right: 1px solid #d2d2d2;
        }
      }
    }
  }
}
::-webkit-scrollbar{
  width: 0.5rem;
  height: 0.5rem;
}
::-webkit-scrollbar-corner,
::-webkit-scrollbar-button{
  display: none;
}
::-webkit-scrollbar-thumb{
  border-radius: 0.5rem;
  background: #404040;
  border: 1px solid #828282;
}
::-webkit-scrollbar-thumb:hover{
  background: #323232
}
::-webkit-scrollbar-track{
  border-radius: 0.5rem;
  background: transparent;
}
@include media{
  ::-webkit-scrollbar{
    width: 0;
    height: 0;
  }
}
</style>