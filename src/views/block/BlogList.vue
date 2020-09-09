<template>
  <div :class="['blog-list', {active: active}]">
    <span class="toggle" @click="toggleList">
      <svg-icon :name="'list'"/>
    </span>
    <div class="list">
      <div v-for="(item, idx) in config.md" :key="idx" @click="clickMd(item.file)" class="md">
        <b class="name">{{ item.name }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: "BlogList",
  data() {
    return {
      active: false,
      config: config
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
          parent = this.$el;
      while (true) {
        if (el === parent) {
          // 点击的东西在div里面
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
      document.removeEventListener('click', this.listenClick)
    }
  }
}
</script>

<style scoped lang="scss">
.blog-list {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 2rem;
  height: 2rem;
  transition: all .25s ease-out;
  border: 1px solid transparent;
  background: white;
  overflow: hidden;
  flex-direction: column;

  &.active {
    width: calc(70% - 1rem);
    height: calc(100% - 4rem);
    padding-bottom: 1rem;
    border: 1px solid #b1b1b1;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    border-radius: 0 0.6rem 0.6rem 0.6rem;
  }

  > .toggle {
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;

    > svg {
      width: 100%;
      height: 100%;
    }
  }

  > .list {
    flex-direction: column;
    margin-top: 3rem;
    overflow-y: auto;
    width: 100%;

    > .md {
      width: 100%;

      > .name {

      }
    }
  }
}
</style>