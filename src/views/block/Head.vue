<template>
  <header class="the-head">
    <div class="body" @mouseenter="toggle(true)" @mouseleave="toggle(false)" flex>
      <a class="favicon" href="/">
        <img :src="selfImage"/>
      </a>
      <a class="txt" href="/simple-code-simple-life" flex title="简单代码，简单生活">{{text}}</a>
    </div>
  </header>
</template>

<script>
import Headroom from "headroom.js";
import selfImage from '@/image/i.png';
const siteConfig = require( '@/site-config');

export default {
  name: "TheHead",
  data() {
    return {
      selfImage,
      text: siteConfig.corner
    }
  },
  mounted() {
    new Headroom(this.$el, {
      offset: this.$el.scrollHeight,
      scroller: document.querySelector('section.body')
    }).init()
  },
  methods: {
    toggle(b) {
      this.$emit('toggle', b)
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.the-head {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $head-height;
  background: rgba(0, 0, 0, 0.1);
  transition: all .15s linear;
  z-index: $z-index-head;
  box-shadow: 0 0 0.5rem rgba(255, 255, 255, 0.2);
  &.headroom--unpinned{
    background: rgba(0, 0, 0, 0.6);
  }
  &.show-bg{
    background: transparent !important;
  }
  > .body{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    justify-content: space-between;
    > .favicon{
      margin-left: 1rem;
      height: 88%;
      border-radius: 0.4rem;
      box-shadow: 0 0 0.4rem rgba(255, 255, 255, 0.3);
      >img{
        border-radius: inherit;
        height: 100%;
        object-fit: contain;
      }
    }
    > .txt{
      font-weight: bold;
      margin: 0 1rem 0 auto;
      height: 100%;
      color: white;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.95rem;
      font-family: "Source Code Pro", serif;
    }
  }
  @include media{
    >.body{
      > .txt{
        font-size: 0.85rem;
        margin-right: 0.3rem;
      }
    }
  }
}
</style>