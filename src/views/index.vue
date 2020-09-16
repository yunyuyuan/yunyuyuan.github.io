<template>
  <div class="index">
    <img :src="images[routeNow]"/>
    <the-head/>
    <section class="body">
      <router-view></router-view>
      <the-footer/>
    </section>
  </div>
</template>

<script>
import TheHead from "@/views/block/Head";
import TheFooter from "@/views/block/Footer";
import HomeImage from '@/image/home.jpg';
import ArticleListImage from '@/image/articleList.jpg';
import ArticleDetailImage from '@/image/articleDetail.jpg';
import msgBoardImage from '@/image/msgBoard.jpg';

export default {
  name: "index",
  components: {TheHead, TheFooter},
  data() {
    return {
      images: {
        home: HomeImage,
        articleList: ArticleListImage,
        articleDetail: ArticleDetailImage,
        msgBoard: msgBoardImage,
        backEnd: msgBoardImage,
      },
      routeNow: 'home'
    }
  },
  watch: {
    $route() {
      switch (this.$route.name) {
        case 'home':
          this.routeNow = 'home'
          break
        case 'article.list':
          this.routeNow = 'articleList'
          break
        case 'article.detail':
          this.routeNow = 'articleDetail'
          break
        case 'msgBoard':
          this.routeNow = 'msgBoard'
          break
        case 'backEnd':
          this.routeNow = 'backEnd'
          break
      }
    }
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
    padding-top: $head-height;
    width: 100%;
    height: calc(100% - #{$head-height});
    overflow-y: auto;
    z-index: $z-index-body;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>