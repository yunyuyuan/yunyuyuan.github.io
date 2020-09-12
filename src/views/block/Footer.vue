<template>
  <footer>
    <img :src="selfImage"/>
    <div class="social-media">
      <a v-for="(k,v) in socialMedia" :key="v" target="_blank" :href="k" :title="v">
        <svg-icon :name="v"/>
      </a>
    </div>
    <div class="copyright">
      <span>Copyright @ 2020 {{ config.name }}</span>
      <span>All Right Reserve</span>
    </div>
  </footer>
</template>

<script>
import selfImage from '@/image/i.png'
import config from "@/config";

export default {
  name: "Footer",
  data() {
    return {
      selfImage,
      config,
      socialMedia: {
        github: 'https://github.com/yunyuyuan',
        bilibili: 'https://space.bilibili.com/204446485',
        mailbox: '1607439239@qq.com'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

footer {
  width: 100%;
  background: #2b2b2b;
  display: flex;
  align-items: center;
  margin-top: auto;
  height: $footer-height;

  > img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin: 0 2rem;
  }

  > .social-media {
    > a {
      margin: 0 1rem;
      background: white;
      border-radius: 0.4rem;
      padding: 0.2rem 0.4rem;
      > svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
  >.copyright{
    height: 100%;
    justify-content: space-around;
    flex-direction: column;
    margin: 0 1rem 0 auto;
    >span{
      color: #bbbbbb;
      font-size: 0.8rem;
    }
  }
}
</style>