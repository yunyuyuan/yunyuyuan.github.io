<template>
  <div class="home">
    <div class="btns">
      <router-link :to="{name: 'article.list'}">
        <svg-icon :name="'article'"/>
        <span>文章</span>
      </router-link>
      <router-link :to="{name: 'msgBoard'}">
        <svg-icon :name="'comments'"/>
        <span>留言板</span>
      </router-link>
    </div>
    <div class="info">
      <div class="head">
        <img :src="selfImage"/>
        <span>{{ config.name }}</span>
      </div>
      <div class="body">
        <span>{{ config.describe }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import selfImage from '@/image/i.png'
import {mapState} from "vuex";

export default {
  name: "Home",
  data() {
    return {
      selfImage,
    }
  },
  computed: {
    ...mapState(['config'])
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.home {
  width: 100%;
  height: calc(100% - #{$footer-height});
  justify-content: space-around;

  > .btns {
    flex-direction: column;
    width: 30%;
    justify-content: center;

    > a {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 0.8rem;
      padding: 1rem 1.5rem;
      margin: 1rem 0;
      width: 8rem;
      text-decoration: none;
      transition: all .15s linear;
      box-shadow: 0 0 0.8rem rgba(255, 255, 255, 0.6);

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }

      > svg {
        width: 2.4rem;
        height: 2.4rem;
      }

      > span {
        color: white;
        font-size: 1.2rem;
        text-align: center;
        flex-grow: 1;
      }
    }
  }

  > .info {
    width: 70%;
    justify-content: center;
    flex-direction: column;

    > .head {
      > img {
        width: 4rem;
        height: 4rem;
        border-radius: 0.3rem;
        margin-right: 2rem;
      }

      > span {
        padding: 0.6rem 0 0.6rem 2rem;
        font-size: 1.3rem;
        font-weight: bold;
        border-left: 2px solid white;
        color: white;
      }
    }

    > .body {
      margin-top: 1rem;

      > span {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.4);
        word-break: break-all;
        font-size: 1rem;
      }
    }
  }
}
</style>