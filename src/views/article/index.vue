<template>
  <div class="article">
    <img :src="articleImage">
    <div class="mask"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import articleImage from '@/image/article.jpg'

export default {
  name: "index",
  data() {
    return {
      articleImage,
    }
  }
}
</script>

<style scoped lang="scss">
.article {
  width: 100%;
  height: 100%;
  position: relative;
  flex-shrink: 0;

  > .mask, > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  > img {
    object-fit: cover;
  }

  > .mask {
    background: rgba(0, 0, 0, 0.15);
  }
}
</style>