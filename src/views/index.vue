<template>
  <div class="index">
    <img :src="images[routeNow]"/>
    <the-head v-if="showHead"/>
    <section :class="{body: true, 'show-head': showHead}" flex>
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
import ArticleDetailImage from '@/image/articleDetail.jpg';
import msgBoardImage from '@/image/msgBoard.jpg';
import recordImage from '@/image/msgBoard.jpg';

import TheHead from "@/views/block/Head";
import TheFooter from "@/views/block/Footer";
import Message from "./block/Message";
import Loading from "@/views/block/Loading";

import Vue from 'vue';

export default {
  name: "index",
  components: {Loading, Message, TheHead, TheFooter},
  data() {
    return {
      showHead: true,
      images: {
        home: HomeImage,
        articleList: ArticleListImage,
        articleDetail: ArticleDetailImage,
        msgBoard: msgBoardImage,
        backend: msgBoardImage,
        record: recordImage,
      },
      routeNow: 'home'
    }
  },
  watch: {
    $route() {
      if (!this.$route.name) return;
      switch (this.$route.name.replace(/^(.*?)\..*$/, '$1')) {
        case 'home':
          this.routeNow = 'home';
          this.showHead = true;
          break;
        case 'article':
          this.routeNow = 'articleList';
          this.showHead = true;
          break;
        case 'msgBoard':
          this.routeNow = 'msgBoard';
          this.showHead = true;
          break;
        case 'backend':
          this.routeNow = 'backend';
          this.showHead = false;
          break;
        case 'record':
          this.routeNow = 'record';
          this.showHead = true;
          break;
      }
    }
  },
  mounted() {
    Vue.prototype.$message = this.$refs.message
  },
  methods: {}
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.index {
  height: 100%;
  width: 100%;
  position: relative;

  > img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: $z-index-bg;
  }

  > .body {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: $z-index-body;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);

    &.show-head {
      padding-top: $head-height;
      height: calc(100% - #{$head-height});
    }
  }
}
</style>