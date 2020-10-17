<template>
  <div class="index">
    <img class="bg" v-if="config.backgroundImg==='img'||(config.backgroundImg==='random'&& (parseInt(Math.random()*10)%2))" :src="images[routeNow]"/>
    <div class="bg" :style="{background: bgColor}" v-else>
      <div :style="waveStyle" class="wave"></div>
      <div :style="waveStyle" class="wave"></div>
    </div>
    <the-head :class="{'show-bg': showBg}" v-if="showHead" @toggle="toggleShowBg"/>
    <section :class="{body: true, 'show-head': showHead, 'show-bg': showBg, 'mask-bg': config.backgroundImg}" flex>
      <router-view></router-view>
      <the-footer v-if="this.routeNow !== 'backend'"/>
    </section>
    <message ref="message"/>
    <loading/>
  </div>
</template>

<script>
import HomeImage from '@/image/home.jpg';
import ArticleListImage from '@/image/articleList.jpg';
import msgBoardImage from '@/image/msgBoard.jpg';
import recordImage from '@/image/record.jpg';
import waveSvg from '@/assets/wave.svg'

import TheHead from "@/views/block/Head";
import TheFooter from "@/views/block/Footer";
import Message from "./block/Message";
import Loading from "@/views/block/Loading";

import Vue from 'vue';
import siteConfig from '@/site-config'
import {mapState} from "vuex";

export default {
  name: "index",
  components: {Loading, Message, TheHead, TheFooter},
  data() {
    return {
      siteConfig,
      showHead: true,
      showBg: false,
      bgColor: '',
      images: {
        home: HomeImage,
        articleList: ArticleListImage,
        msgBoard: msgBoardImage,
        backend: HomeImage,
        record: recordImage,
      },
      routeNow: 'home'
    }
  },
  computed: {
    ...mapState(['config']),
    waveStyle (){
      return {
        background: `url(${waveSvg}) repeat-x`
      }
    }
  },
  watch: {
    $route() {
      if (!this.$route.name) return;
      switch (this.$route.name.replace(/^(.*?)\..*$/, '$1')) {
        case 'home':
          this.routeNow = 'home';
          this.bgColor = 'linear-gradient(45deg, #ff7e10 0%, #3c2fff 80%, #00c7ff)';
          this.showHead = true;
          break;
        case 'article':
          this.routeNow = 'articleList';
          this.bgColor = 'linear-gradient(135deg, rgb(16, 112, 255) 0%, rgb(13 220 186) 60%, rgb(255 235 0))';
          this.showHead = true;
          break;
        case 'record':
          this.routeNow = 'record';
          this.bgColor = 'linear-gradient(45deg, rgb(255 16 204) 0%, rgb(47 245 255) 80%, rgb(0 255 67))';
          this.showHead = true;
          break;
        case 'msgBoard':
          this.routeNow = 'msgBoard';
          this.bgColor = 'linear-gradient(135deg, rgb(31 16 255) 0%, rgb(255 47 220) 80%, rgb(255 165 0))';
          this.showHead = true;
          break;
        case 'backend':
          this.routeNow = 'backend';
          this.bgColor = 'linear-gradient(45deg, rgb(255 159 16) 0%, rgb(0 243 255) 80%, rgb(180 0 255))';
          this.showHead = false;
          break;
      }
    }
  },
  mounted() {
    Vue.prototype.$message = this.$refs.message
  },
  methods: {
    toggleShowBg(b) {
      this.showBg = b
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.index {
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