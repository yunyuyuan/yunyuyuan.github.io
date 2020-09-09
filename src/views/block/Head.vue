<template>
  <section class="the-head">
    <div class="body">
      <span class="toggle" @click="toggleList">
        <svg-icon :name="'list'"/>
      </span>
      <b class="txt">
        Simple Code,Simple Life
      </b>
    </div>
    <div :class="['list', {active: active}]">
      <div class="md">
        <div v-for="(item, idx) in config.md" :key="idx" @click="clickMd(item.file)">
          <b class="name">{{ item.name }}</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import config from '@/config'

export default {
  name: "BlogList",
  data() {
    return {
      active: false,
      config: config,
    }
  },
  methods: {
    toggleList() {
      this.active = !this.active
      document.removeEventListener('click', this.listenClick)
      if (this.active) {
        document.addEventListener('click', this.listenClick)
      }
    },
    listenClick(e) {
      let el = e.target,
          parent = this.$el.querySelector('.list'),
          toggle = this.$el.querySelector('.toggle');
      while (true) {
        if (el === parent || el === toggle) {
          // 点击的东西在div里面 或 点击toggle
          break
        }
        el = el.parentElement
        if (el) {
        } else {
          // 到头
          this.active = false
          document.removeEventListener('click', this.listenClick)
          break
        }
      }
    },
    clickMd(file) {
      this.active = false
      this.$store.commit('changeMd', file)
      document.removeEventListener('click', this.listenClick)
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
  background: white;
  border-bottom: 1px solid gray;
  z-index: $z-index-head;

  > .body {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;

    > .toggle {
      margin-left: 1rem;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      background: inherit;
      transition: all .15s linear;

      &:hover {
        box-shadow: 0 0 0.6rem gray;
      }

      > svg {
        width: 100%;
        height: 100%;
      }
    }

    > .txt {
      margin: 0 1rem 0 auto;
    }
  }

  > .list {
    position: fixed;
    top: 3rem;
    left: 0;
    width: 65%;
    height: calc(100% - 3rem);
    overflow: hidden;
    transition: all 0.25s ease-out;
    transform: translateX(-110%);
    border-radius: 0 0.6rem 0.6rem 0;
    border: 1px solid #dcdcdc;
    z-index: $z-index-blog-list;
    background: white;

    &.active {
      transform: translateX(0);
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    }

    > .md {
      width: 100%;
      height: 100%;
      flex-direction: column;
      overflow-y: auto;

      > div {
        width: 100%;
        height: 3rem;
        flex-shrink: 0;
        border-bottom: 1px solid #c4c4c4;

        > .name {
          padding: 0 0.8rem;
          font-size: 1rem;
          word-break: break-all;
        }
      }
    }
  }
}
</style>