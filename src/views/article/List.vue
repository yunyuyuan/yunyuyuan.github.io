<template>
  <div class="article">
    <div class="list" flex>
      <div class="head" flex>
        <label onclick="this.querySelector('input').focus()" :class="{search: true, active: searchFocus}" flex>
          <input v-model="search" @focusin="toggleInputFocus(true)" @focusout="toggleInputFocus(false)"/>
          <span flex><svg-icon :fill="searchFocus?'black':'#ddd'" name="search"/></span>
        </label>
        <div class="view">
          <a :class="{active: activeView==='list'}" @click="toggleView('list')">列表</a>
          <a :class="{active: activeView==='simple'}" @click="toggleView('simple')">简要</a>
        </div>
      </div>
      <div class="tags" flex>
      <span @click="removeTag(tag)" v-for="tag in searchTags" :key="tag"
            :style="{background: $options.filters.color(tag)}" flex>
        {{ tag }}
        <span title="取消过滤">
          <svg-icon name="trash"/>
        </span>
      </span>
      </div>
      <div class="loading" v-if="loading" flex>
        <svg-icon name="loading"/>
      </div>
      <div class="blog" :class="activeView" v-else>
        <template v-if="activeView==='list'">
          <div v-for="(item, idx) in this.pagedList" :key="item.file" class="list-item"
               :class="{active: activeItem===item.file}" flex>
            <div class="time" flex>
              <span>{{ item.time | time(true) }}</span>
              <div flex>
                <span>最后修改</span>
                <time>{{ item.modifyTime | time(true) }}</time>
              </div>
            </div>
            <div class="mid" flex>
              <span class="line"></span>
              <span class="circle"></span>
            </div>
            <a class="info" :href="`/article/${item.file}`" flex @mouseenter="activeItem=item.file" @mouseleave="activeItem=null">
              <loading-img :src="item.cover" :size="[-1, 10]"/>
              <div class="detail" flex>
                <b>{{ item.name }}</b>
                <span>{{ item.summary }}</span>
                <div class="tags" flex>
                  <span class="tag" v-for="tag in item.tags" @click.prevent.stop="addTag(tag)"
                        :style="{background: $options.filters.color(tag)}"
                        :title="`搜索-${tag}`">{{ tag }}</span>
                  <span class="comment" flex>
                    <svg-icon name="comments"/>
                    {{commentNumDict[item.file]}}
                  </span>
                </div>
              </div>
            </a>
          </div>
          <pagination @turn="turnPage" :item-count="this.resultList.length" :page-now="pageNow" :per-count="perCount"/>
        </template>
        <div class="simple" v-else flex>
          <div v-for="a in datedList" class="year" flex>
            <b write-font :title="a[0]+'年'">{{ a[0]+'年' }}</b>
            <div v-for="b in a[1]" class="month" flex>
              <b write-font :title="b[0]+'月'">{{ b[0]+'月' }}</b>
              <div class="list" flex>
                <div v-for="item in b[1]" class="simple-item" flex>
                  <time write-font>{{ simpleTime(item.time) }}</time>
                  <a :href="`/article/${item.file}`">{{ item.name }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingImg from "@/components/LoadingImg";
import Pagination from "@/components/Pagination";
import {getText, loadFinish} from "@/utils/utils";
import {originPrefix} from "@/need";
import {queryMap} from "@/route";
import {getCommentNum} from "@/views/comment/utils";
import dayjs from "dayjs";

export default {
  name: "List",
  components: {Pagination, LoadingImg},
  data() {
    return {
      md: [],
      loading: true,
      search: '',
      cacheSearch: '',
      searchFocus: false,
      searchTags: [],
      cacheSearchTags: [],
      activeView: 'list',
      activeItem: null,
      pageNow: 1,
      perCount: 8,
      commentNumDict: {}
    }
  },
  computed: {
    pagedList() {
      const start = (this.pageNow - 1) * this.perCount;
      return this.resultList.slice(start, start + this.perCount)
    },
    datedList() {
      const res = [];
      for (const e of this.md){
        const time = dayjs(e.time);
        const year = time.year();
        const month = time.format('MM');
        let find_year = res.find(e=>e[0]===year);
        if (!find_year){
          find_year = [year, []];
          res.push(find_year);
        }
        const month_list = find_year[1];
        let find_month = month_list.find(e=>e[0]===month);
        if (!find_month){
          find_month = [month, []];
          month_list.push(find_month);
        }
        find_month[1].push(e);
      }
      return res
    },
    resultList() {
      if (!this.search && !this.searchTags.length) return this.md;
      const lis = [],
          vm = this;
      for (const e of this.md){
        if (!vm.search || e.name.indexOf(vm.search) !== -1) {
          let tagMatched = true;
          for (let idx = 0; idx < vm.searchTags.length; idx++) {
            if (e.tags.indexOf(vm.searchTags[idx]) === -1) {
              tagMatched = false
            }
          }
          if (tagMatched) {
            lis.push(e)
          }
        }
      }
      return lis
    },
    getMdList (){
      return this._needMdToRef()
    }
  },
  inject: ['_needMdToRef'],
  watch: {
    resultList() {
      // 重置pageNow
      this.pageNow = 1;
    },
    pagedList (){
      // 评论数
      this.commentNumDict = {};
      this.pagedList.forEach((e, idx)=>{
        getCommentNum(e.file).then(res=>{
          this.$set(this.commentNumDict, e.file, res[0]?res[1].data.data.search.issueCount:0)
        })
      })
    }
  },
  async mounted() {
    loadFinish();
    this.getMdList.then(res=>{
      this.md = res;
      let tag = queryMap()['search-tag'];
      if (tag) {
        tag = decodeURIComponent(tag);
        if (this.md.find(v => v.tags.indexOf(tag) !== -1)) {
          this.searchTags = [tag]
        }
      }
    })
    this.loading = false;
  },
  methods: {
    toggleInputFocus(b) {
      this.searchFocus = b
    },
    toggleView(v){
      this.activeView = v;
      if (v === 'list'){
        this.search = this.cacheSearch;
        this.searchTags = this.cacheSearchTags.slice();
      }else{
        this.cacheSearch = this.search;
        this.cacheSearchTags = this.searchTags.slice();
        this.search = '';
        this.searchTags = [];
      }
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
    },
    turnPage(p) {
      this.pageNow = p;
    },
    simpleTime (time){
      return new dayjs(time).format(`MM.DD`)
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.article {
  width: 100%;
  min-height: 100%;
  position: relative;
  flex-shrink: 0;

  > .list {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    flex-direction: column;
    overflow-y: auto;

    >.head {
      width: calc(100% - 2rem);
      padding: 0 1rem;
      justify-content: space-between;
      flex-wrap: wrap;
      > .search {
        border-radius: 1rem;
        border: 1px solid #787878;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.3rem;
        box-shadow: 0 0 0.5rem #d2d2d2;
        transition: all .1s linear;
        margin: 1rem auto;

        &.active {
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);

          > input {
            color: black;
          }
        }

        > input {
          width: 15rem;
          height: 100%;
          font-size: 0.9rem;
          border: none;
          padding-left: 0.5rem;
          background: transparent;
          color: #d6d6d6;
        }

        > span {
          justify-content: center;

          > svg {
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.3rem;
          }
        }
      }
      >.view{
        flex-shrink: 0;
        box-shadow: 0 0 .8rem rgba(0, 0, 0, .4);
        >a{
          font-size: .85rem;
          cursor: pointer;
          background: white;
          padding: .3rem .6rem;
          &.active{
            background: #0073ff;
            color: white;
            cursor: default;
          }
          $r: 4px;
          &:first-of-type{
            border-radius: $r 0 0 $r;
            border-right: 1px solid black;
          }
          &:last-of-type{
            border-radius: 0 $r $r 0;
          }
        }
      }
    }

    > .tags {
      transition: all .15s linear;
      width: 80%;
      flex-wrap: wrap;

      > span {
        padding: 0.5rem 1.3rem;
        cursor: pointer;
        transition: all .1s linear;
        font-size: 0.96rem;
        margin: 1rem;
        height: 1.2rem;
        line-height: 1.8rem;
        box-shadow: 0 0 0.4rem #000000a1;
        color: white;
        position: relative;

        > span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;

          > svg {
            width: 1.4rem;
            height: 100%;
          }
        }

        &:hover {
          > span {
            display: flex;
          }
        }
      }
    }
    >.loading{
      width: 100%;
      margin: 3rem 0;
      justify-content: center;
      >svg{
        width: 5rem;
        height: 5rem;
      }
    }

    > .blog {
      width: 100%;
      margin: 1rem 0;
      flex-grow: 1;
      overflow-x: auto;

      > .list-item {
        width: 60rem;
        height: 10rem;
        padding: 1rem 0;
        overflow: hidden;
        margin: 0 auto;
        &.active{
          >.time {
            > span {
              background: rgba(0, 0, 0, .8);
            }

            > div {
              height: 3rem;
              opacity: 1;
              margin-top: .4rem;
              padding: 0.2rem 0.4rem;
            }
          }
          >.mid{
          }
          >.info{
            ::v-deep img{
              transform: scale(1.1);
            }
          }
        }
        > .time {
          flex-direction: column;
          > span {
            transition: background .15s linear;
            background: rgba(0, 0, 0, .5);
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 0.4rem;
            font-size: 0.9rem;
            word-break: keep-all;
            white-space: nowrap;
            flex-shrink: 0;
          }
          >div{
            flex-direction: column;
            justify-content: space-around;
            height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all .15s linear;
            font-size: .85rem;
            background: rgba(0, 0, 0, .8);

            >span{
              font-size: .9em;
              color: white;
            }
            >time{
              color: #00ffcc;
            }
          }
        }

        > .mid {
          justify-content: center;
          width: 2rem;
          height: calc(100% + 2rem);
          padding: 0 1rem;
          margin: 0 0.3rem;
          position: relative;
          transition: all .15s linear;
          overflow: hidden;
          opacity: 1;

          > .line {
            width: 100%;
            height: 0.2rem;
            background: #fff;
            position: absolute;
            border: 1px solid black;
          }

          > .circle {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            border: 2px solid #505050;
            background: #00f3ff;
            z-index: 1;
            flex-shrink: 0;
          }
        }

        > .info {
          height: 100%;
          width: 100%;
          box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.6);
          text-decoration: none;
          color: black;
          border-radius: 0 0.5rem 0.5rem 0;
          background: white;

          ::v-deep .loading-img {
            display: flex;
            align-items: center;
            border-right: 1px solid gray;
            overflow: hidden;

            img {
              object-fit: cover;
              background: white;
              border: none !important;
              transition: transform .15s linear;
            }
          }

          > .detail {
            height: 100%;
            width: 38rem;
            flex-grow: 0;
            border-radius: 0 0.5rem 0.5rem 0;
            flex-direction: column;
            flex-shrink: 0;
            margin-left: auto;

            > b {
              font-size: 1.2rem;
              @include text-overflow(2);
              margin: 0.5rem 0;
              line-height: 1.5rem;
              text-align: center;
            }

            > span {
              font-size: 0.88rem;
              color: #686868;
              line-height: 1.2rem;
              @include text-overflow(3);
              text-align: center;
            }

            > .tags {
              width: 100%;
              height: 2rem;
              justify-content: flex-end;
              margin-top: auto;

              > .tag {
                font-size: 0.8rem;
                line-height: 1rem;
                border-radius: 0.1rem;
                padding: 0.2rem 0.6rem;
                margin-right: 0.5rem;
                transition: all .15s linear;
                box-shadow: 0 0 0.2rem #00000078;
                color: white;
                &:first-of-type{
                  margin-left: 1rem;
                }
                &:hover {
                  box-shadow: 0 .15rem 0.4rem #00000078;
                }
              }
              >.comment{
                >svg{
                  width: 1rem;
                  height: 1rem;
                  margin: 0 .3rem 0 .6rem;
                }
                font-size: .85rem;
                margin-right: .8rem;
                margin-left: auto;
              }
            }
          }
        }
      }
      >.simple {
        flex-direction: column;
        background: whitesmoke;
        margin: 1rem auto;
        width: 50rem;
        border-radius: .3rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, .6);
        padding: 1rem;
        > .year {
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          padding: .6rem 0;

          > b {
            font-size: 1.6rem;
            color: #c5470c;
            padding: .4rem 0;
          }

          > .month {
            align-items: flex-start;
            width: 100%;
            &:not(:last-of-type){
              margin-bottom: .5rem;
            }
            > b {
              flex-shrink: 0;
              line-height: 2rem;
              font-size: 1.3rem;
              color: #007680;
              width: 4rem;
              text-align: center;
            }
            >.list {
              flex-direction: column;
              align-items: flex-start;
              width: 100%;
              > .simple-item {
                align-items: center;
                line-height: 2rem;
                > time {
                  margin-right: .3rem;
                  font-size: 1.1rem;
                  color: #232323;
                  flex-shrink: 0;
                }

                > a {
                  font-size: .95rem;
                  text-decoration: none;
                  color: black;
                  border-left: 1px solid gray;
                  padding-left: .5rem;
                  &:hover{
                    text-decoration: underline;
                    color: #0003ff;
                  }
                }
              }
            }
          }
        }
      }
    }

    @include media {
      > .blog {
        > .list-item {
          width: 98%;

          > .time {
            display: none;
          }

          > .mid {
            display: none;
          }
          >.info {
            position: relative;
            border-radius: 0.5rem;
            ::v-deep > .loading-img, >.detail{
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: inherit;
            }
            ::v-deep > .loading-img{
              z-index: 1;
            }
            > .detail {
              background: rgba(255, 255, 255, .9);
              z-index: 2;
            }
          }
        }
        >.simple{
          width: calc(98% - 2rem);
        }
      }
    }
  }
}
</style>
