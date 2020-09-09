<template>
  <footer>
    <img :src="selfImage"/>
    <div class="social-media">
      <a v-for="(k,v) in socialMedia" :key="v" target="_blank" :href="k">
        <svg-icon :name="v"/>
      </a>
    </div>
  </footer>
</template>

<script>
import selfImage from '@/image/i.png'

export default {
  name: "Footer",
  data() {
    return {
      selfImage,
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
footer {
  width: 100%;
  background: #2b2b2b;
  display: flex;
  align-items: center;
  padding: 1rem 0;
  margin-top: auto;

  > img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin: 0 2rem;
  }

  > .social-media {
    > a {
      width: 2rem;
      height: 2rem;
      margin: 0 1rem;
      background: white;
      border-radius: 0.2rem;

      > svg {
        width: 100%;
        height: 100%;

      }
    }
  }
}
</style>