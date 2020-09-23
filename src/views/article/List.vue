<template>
  <div class="list">
    <div onclick="this.querySelector('input').focus()" :class="{search: true, active: searchFocus}">
      <input v-model="search" @focusin="toggleInputFocus(true)" @focusout="toggleInputFocus(false)"/>
      <span>
          <svg-icon :fill="searchFocus?'black':'#ddd'" :name="'search'"/>
      </span>
    </div>
    <div class="tags">
      <span @click="removeTag(tag)" v-for="tag in searchTags" :key="tag">{{ tag }}</span>
    </div>
    <div class="blog">
      <div v-for="item in this.config.md" :key="item.file" :class="{item: true, hidden: resultList.indexOf(item)===-1}">
        <div class="time">
          <span>{{ item.createTime }}</span>
        </div>
        <div class="mid">
          <span class="line"></span>
          <span class="circle"></span>
        </div>
        <router-link class="info" :to="{name: 'article.detail', params: {id: item.file}}">
          <img :src="item.cover || defaultCover">
          <div>
            <span>{{ item.name }}</span>
            <div class="tags">
              <span v-for="tag in item.tags" @click.prevent.stop="addTag(tag)" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import defaultCover from '@/image/default-cover.png';

export default {
  name: "List",
  data() {
    return {
      defaultCover,
      search: '',
      searchFocus: false,
      searchTags: [],
    }
  },
  computed: {
    ...mapState(['config']),
    resultList() {
      if (!this.search && !this.searchTags.length) return this.config.md;
      let lis = [],
          vue_ = this;
      this.config.md.forEach(e => {
        if (!vue_.search || e.name.indexOf(vue_.search) !== -1) {
          let tagMatched = true;
          for (let idx = 0; idx < vue_.searchTags.length; idx++) {
            if (e.tags.indexOf(vue_.searchTags[idx]) === -1) {
              tagMatched = false
            }
          }
          if (tagMatched) {
            lis.push(e)
          }
        }
      });
      return lis
    }
  },
  methods: {
    toggleInputFocus(b) {
      this.searchFocus = b
    },
    addTag(tag) {
      if (this.searchTags.indexOf(tag) === -1) {
        this.searchTags.push(tag)
      } else {
        this.removeTag(tag)
      }
    },
    removeTag(tag) {
      this.searchTags.splice(this.searchTags.indexOf(tag), 1)
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
  flex-direction: column;

  > .search {
    border-radius: 1rem;
    border: 1px solid #787878;
    background: rgba(0, 0, 0, 0.2);
    margin-top: $head-height+1rem;
    padding: 0.3rem;
    box-shadow: 0 0 0.5rem #d2d2d2;
    transition: all .1s linear;
    margin-bottom: 1rem;

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

  > .tags {
    transition: all .15s linear;
    width: 80%;
    height: 3rem;

    > span {
      background: #00f3ff;
      padding: 0.3rem 0.8rem;
      cursor: pointer;
      transition: all .1s linear;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      margin: 0 1rem;
      height: 1.2rem;
      line-height: 1.8rem;
      box-shadow: 0 0 0.4rem #000000a1;

      &:hover {
        background: #ff5757;
        color: white;
      }
    }
  }

  > .blog {
    flex-direction: column;
    width: 50rem;
    overflow-y: auto;
    margin-top: 1rem;

    > .item {
      width: 100%;
      height: 5rem;
      padding: 1rem 0;
      transition: all .15s linear;
      overflow: hidden;

      &.hidden {
        padding: 0;
        height: 0;
      }

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

        > div {
          height: 100%;
          width: 100%;
          background: white;
          border-radius: 0 0.5rem 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          box-shadow: 0 0 0.4rem rgba(128, 128, 128, 0.59) inset;

          > span {
            font-size: 1.1rem;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          > .tags {
            width: 100%;
            height: 2rem;
            justify-content: flex-end;

            > span {
              font-size: 0.1rem;
              line-height: 1rem;
              background: #00f3ff;
              border-radius: 0.1rem;
              padding: 0.2rem 0.6rem;
              margin-right: 0.5rem;
              transition: all .15s linear;
              box-shadow: 0 0 0.2rem #00000078;

              &:hover {
                background: #444444;
                color: white;
              }
            }
          }
        }
      }
    }
  }
}
</style>