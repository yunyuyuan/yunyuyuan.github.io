<template>
  <footer flex>
    <router-link class="favicon" :to="{name: 'home'}">
      <img :src="selfImage"/>
    </router-link>
    <div class="social-media" flex>
      <a v-for="k in links" :key="k" target="_blank" :href="config[k]" :title="k" flex>
        <svg-icon :name="k"/>
      </a>
    </div>
    <div class="copyright" flex>
      <span>Copyright (c) @ {{ config.copyright }} <b>{{ config.name }} | {{ domain }}</b></span>
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
      links: ['github', 'bilibili', 'email']
    }
  },
  computed: {
    ...mapState(['config']),
    domain() {
      return location.hostname
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

footer{
  width: 100%;
  background: #2b2b2b;
  margin-top: auto;
  height: $footer-height;
  box-shadow: 0 0 1rem #020202;
  z-index: $z-index-footer;
  >.favicon{
    margin: 0 2rem;
    height: 4rem;
    > img{
      height: 100%;
      object-fit: contain;
      border-radius: 0.5rem;
    }
  }
  > .social-media{
    > a{
        margin: 0 1rem;
        background: white;
        border-radius: 0.4rem;
        padding: 0.2rem 0.4rem;
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