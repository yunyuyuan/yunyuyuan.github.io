<template>
  <footer>
    <img :src="selfImage"/>
    <div class="social-media">
      <a v-for="(k,v) in config.socialMedia" :key="v" target="_blank" :href="k" :title="v">
        <svg-icon :name="v"/>
      </a>
    </div>
    <div class="copyright">
      <span>Copyright @ {{ config.copyright }} <b>{{ config.name }}</b></span>
      <span>All Right Reserve</span>
    </div>
  </footer>
</template>

<script>
import selfImage from '@/image/i.png'
import {mapState} from "vuex";

export default {
  name: "Footer",
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

footer{
  width: 100%;
  background: #2b2b2b;
  display: flex;
  align-items: center;
  margin-top: auto;
  height: $footer-height;
  box-shadow: 0 0 1rem #020202;
  z-index: $z-index-footer;
  > img{
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin: 0 2rem;
  }
  > .social-media{
    > a{
        margin: 0 1rem;
        background: white;
        border-radius: 0.4rem;
        padding: 0.2rem 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        > svg{
            width: 1.6rem;
            height: 1.6rem;
        }
    }
  }
  >.copyright{
      height: 100%;
      justify-content: center;
      flex-direction: column;
      margin: 0 1rem 0 auto;
      > span{
        color: #bbbbbb;
        font-size: 0.8rem;
        margin: 0.5rem 0;
        > b{
          color: #ddd;
        }
      }
  }
}
</style>