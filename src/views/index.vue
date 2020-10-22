<template>
  <div id="index">
<!--  放在最前面防止 mounted() 时<loading/>还不存在  -->
    <loading :class="configLoaded"/>

    <NotFound v-if="routeNow===''"/>
    <img class="bg" v-else-if="config.backgroundImg==='img'||(config.backgroundImg==='random'&& rand)" :src="images[routeNow]" alt="bg"/>
    <div class="bg" :style="{background: bgColor}" v-else>
      <div :style="waveStyle" class="wave"></div>
      <div :style="waveStyle" class="wave"></div>
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
import waveSvg from '@/assets/wave.svg'

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
  filter (img){
    return img.hasAttribute('data-viewer')
  }
})

export default {
  name: "index",
  components: {Loading, Message, TheHead, TheFooter, NotFound},
  data() {
    return {
      config: {},
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
      configLoaded: ''
    }
  },
  provide() {
    return {
      _config: () => this.computeConfig
    }
  },
  computed: {
    rand (){
      return Math.floor(Math.random()*10)%2
    },
    waveStyle (){
      return {
        background: `url(${waveSvg}) repeat-x`
      }
    },
    computeConfig (){
      return this.config
    }
  },
  async created() {
    const route = routeInfo();
    document.title = route.title;
    document.head.querySelector('meta[name=keywords]').setAttribute('content', route.keywords);
    document.head.querySelector('meta[name=description]').setAttribute('description', route.keywords);

    this.showHead = route.name !== 'backend';
    if (['articleDetail', 'msgBoard', 'backend'].indexOf(route.name) !== -1) {
      // 加载markdown.css
      fetch(`${originPrefix}/markdown.css?ran=${new Date().getTime()}`).then(res=>{
        res.text().then(text=>{
          document.head.querySelector('#markdown-stylesheet').innerHTML = text;
        })
      })
    }

    switch (route.name){
      case 'index':
        this.routeNow = 'home';
        this.bgColor = 'linear-gradient(45deg, #ff7e10 0%, #3c2fff 80%, #00c7ff)';
        this.comp = ()=>import('@/views/home/index')
        break;
      case 'article':
        this.routeNow = 'article';
        this.bgColor = 'linear-gradient(135deg, rgb(16, 112, 255) 0%, rgb(13, 220, 186) 60%, rgb(255, 235, 0))';
        this.comp = ()=>import('@/views/article/List')
        break;
      case 'articleDetail':
        this.routeNow = 'articleDetail';
        this.bgColor = 'linear-gradient(135deg, rgb(16, 112, 255) 0%, rgb(13, 220,186) 60%, rgb(255, 235, 0))';
        this.comp = ()=>import('@/views/article/Detail')
        break;
      case 'record':
        this.routeNow = 'record';
        this.bgColor = 'linear-gradient(45deg, rgb(255, 16, 204) 0%, rgb(47, 245, 255) 80%, rgb(0, 255, 67))';
        this.comp = ()=>import('@/views/record/index')
        break;
      case 'msgBoard':
        this.routeNow = 'msgBoard';
        this.bgColor = 'linear-gradient(135deg, rgb(31, 16, 255) 0%, rgb(255, 47, 220) 80%, rgb(255, 165, 0))';
        this.comp = ()=>import('@/views/msg-board/index')
        break;
      case 'backend':
        this.routeNow = 'backend';
        this.bgColor = 'linear-gradient(45deg, rgb(255, 159, 16) 0%, rgb(0, 185, 255) 80%, rgb(214, 117, 255))';
        this.comp = ()=>import('@/views/backend/index')
        break;
      case 'about':
        this.routeNow = 'about';
        this.bgColor = 'linear-gradient(45deg, rgb(255, 97, 74) 0%, rgb(129, 255, 185) 80%, rgb(189, 167, 255))';
        this.comp = ()=>import('@/views/about/index')
        break
      default:
        this.routeNow = ''
    }
  },
  async mounted() {
    Vue.prototype.$message = this.$refs.message;
    await this.updateConfig();
    this.configLoaded = 'config-loaded'
  },
  methods: {
    toggleShowBg(b) {
      this.showBg = b
    },
    async updateConfig(config) {
      if (config){
        this.config = config
      }else {
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

#index {
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
    >.wave {
      position: absolute;
      bottom: 0;
      width: 6400px;
      height: 198px;
      animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
      transform: translate3d(0, 0, 0);
    }

    .wave:nth-of-type(2) {
      bottom: 0;
      animation: wave 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 7s ease -1.25s infinite;
      opacity: 1;
    }

    @keyframes wave {
      0% {
        margin-left: 0;
      }
      100% {
        margin-left: -1600px;
      }
    }

    @keyframes swell {
      0%, 100% {
        transform: translate3d(0,-25px,0);
      }
      50% {
        transform: translate3d(0,5px,0);
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
* {
  margin: 0;
  padding: 0;
}

*[flex] {
  display: flex;
  align-items: center;
}

*[is-dialog] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index-dialog;
  background: rgba(0, 0, 0, 0.4);
  justify-content: space-around;

  &, > .inner {
    display: flex;
    align-items: center;
  }

  > .inner {
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

input, textarea, select, button {
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