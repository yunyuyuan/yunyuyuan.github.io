<template>
  <div class="list">
    <div class="inner">
      <div onclick="this.querySelector('input').focus()" :class="{search: true, active: searchFocus}">
        <input v-model="search" @focusin="toggleInputFocus(true)" @focusout="toggleInputFocus(false)"/>
        <span>
            <svg-icon :fill="searchFocus?'black':'#ddd'" :name="'search'"/>
        </span>
      </div>
      <div class="blog">
        <div v-for="item in this.config.md" :key="item.file" class="item" v-show="searchList.indexOf(item)!==-1">
          <div class="time">
            <span>{{ item.time }}</span>
          </div>
          <div class="mid">
            <span class="line"></span>
            <span class="circle"></span>
          </div>
          <router-link class="info" :to="{name: 'article.detail', params: {id: item.file}}">
            <img :src="`/md/${item.file}/${item.cover}`">
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";

export default {
  name: "List",
  data() {
    return {
      config,
      search: '',
      searchFocus: false
    }
  },
  computed: {
    searchList() {
      if (!this.search) return this.config.md;
      let lis = [];
      this.config.md.forEach(e => {
        if (e.name.indexOf(this.search) !== -1) {
          lis.push(e)
        }
      });
      return lis
    }
  },
  methods: {
    toggleInputFocus(b) {
      this.searchFocus = b
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.list {
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  > .inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;

    > .search {
      border-radius: 1rem;
      border: 1px solid #787878;
      background: rgba(0, 0, 0, 0.2);
      margin-top: $head-height+1rem;
      padding: 0.3rem;
      box-shadow: 0 0 0.5rem #d2d2d2;
      transition: all .1s linear;

      &.active {
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
      }

      > input {
        width: 15rem;
        height: 100%;
        font-size: 0.9rem;
        border: none;
        padding-left: 0.5rem;
        background: transparent;
      }

      > span {
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
        }
      }
    }

    > .blog {
      flex-direction: column;
      width: 50rem;
      overflow-y: auto;
      margin-top: 2rem;

      > .item {
        width: 100%;
        padding: 1rem 1rem 1rem 0;

        > .time {
          > span {
            background: rgba(0, 0, 0, 0.4);
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 0.4rem;
            font-size: 0.9rem;
          }
        }

        > .mid {
          justify-content: center;
          height: calc(100% + 2rem);
          padding: 0 1rem;
          margin: 0 0.3rem;
          position: relative;

          > .line {
            width: 100%;
            height: 0.1rem;
            background: black;
            position: absolute;
          }

          > .circle {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            border: 0.16rem solid black;
            background: #00f3ff;
            z-index: 1;
          }
        }

        > .info {
          height: 6rem;
          width: 100%;
          box-shadow: 0 0 0.5rem #171717;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: black;
          border-radius: 0 0.5rem 0.5rem 0;

          > img {
            height: 100%;
            object-fit: contain;
            box-shadow: 1rem 0 1rem -1rem #a8a8a8;
            z-index: 1;
          }

          > span {
            height: 100%;
            width: 100%;
            background: white;
            border-radius: 0 0.5rem 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            box-shadow: 0 0 0.4rem rgba(128, 128, 128, 0.59) inset;
          }
        }
      }
    }
  }
}
</style>