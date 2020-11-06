<template>
  <div class="back-end">
    <div class="menu" :class="{hide: !showMenu}" flex>
      <div class="pendant" flex="">
        <span class="toggle-menu" :class="{opened: showMenu}" @click="toggleMenu">
          <svg viewBox="0 0 100 100">
            <path class="line line1"
                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"/>
            <path class="line line2" d="M 20,50 H 80"/>
            <path class="line line3"
                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"/>
          </svg>
        </span>
      </div>
      <router-link v-for="item in menu" :key="item.name" :to="{path: item.pathName}"
                   :class="{active: $route.path.indexOf(item.pathName)===0}" class="item" flex>
        <span class="icon">
          <svg-icon :name="item.icon"/>
        </span>
        <span class="name">{{ item.name }}</span>
      </router-link>
      <a class="home" href="/" flex="" title="回到主页">
        <img :src="selfImage" alt="favicon"/>
      </a>
      <loading-button :icon="'account'" :text="'登录'" @click.native="showLogin = true"/>
    </div>
    <login v-show="showLogin" @gitUtil="initGitUtil" @save="loginFinish" @hide="showLogin = false"/>
    <div class="body">
      <keep-alive>
        <router-view @login="showLogin = true"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Login from "./utils/Login";
import {getText, loadFinish, parseAjaxError} from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";
import {originPrefix} from "@/need";
import selfImage from '@/image/i.png';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);


export default {
  name: "index",
  components: {LoadingButton, Login},
  router: new VueRouter({
    routes: [
      {
        path: '/',
        redirect: '/config'
      },
      {
        path: '/config',
        component: ()=>import('@/views/backend/config/Config')
      },
      {
        path: '/article',
        component: ()=>import('@/views/backend/article/Article'),
        children: [
          {
            path: '',
            component: ()=>import('@/views/backend/article/ArticleList'),
          },
          {
            path: ':id',
            component: ()=>import('@/views/backend/article/ArticleDetail'),
          }
        ]
      },
      {
        path: '/record',
        component: ()=>import('@/views/backend/record/Record'),
        children: [
          {
            path: '',
            component: ()=>import('@/views/backend/record/RecordList'),
          },
          {
            path: ':id',
            component: ()=>import('@/views/backend/record/RecordDetail'),
          }
        ]
      },
      {
        path: '/comments',
        component: ()=>import('@/views/backend/comment/Comment')
      },
      {
        path: '/dashboard',
        component: ()=>import('@/views/backend/dashboard/Dashboard')
      },
      {
        path: '/theme',
        component: ()=>import('@/views/backend/theme/Theme')
      },
      {
        path: '/version',
        component: ()=>import('@/views/backend/version/Version')
      }
    ]
  }),
  data() {
    return {
      selfImage,
      showMenu: (localStorage.getItem('show-menu')||'true')==='true',
      showLogin: false,
      updating: false,
      gitUtil: null,
      token: '',
      menu: [
        {
          name: '配置',
          pathName: '/config',
          icon: 'config'
        },
        {
          name: '文章',
          pathName: '/article',
          icon: 'article'
        },
        {
          name: '记录',
          pathName: '/record',
          icon: 'record'
        },
        {
          name: '主题',
          pathName: '/theme',
          icon: 'brash'
        },
        {
          name: '版本',
          pathName: '/version',
          icon: 'version'
        },
        {
          name: '面板',
          pathName: '/dashboard',
          icon: 'dashboard'
        },
        {
          name: '评论',
          pathName: '/comments',
          icon: 'comments'
        },
      ]
    }
  },
  computed: {
    computeGitUtil (){
      return this.gitUtil
    },
    computeToken (){
      return this.token
    }
  },
  provide() {
    return {
      _gitUtil: () => this.computeGitUtil,
      _token: () => this.computeToken
    }
  },
  mounted() {
    loadFinish();
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
      localStorage.setItem('show-menu', this.showMenu.toString());
    },
    initGitUtil ({instance, token}){
      this.gitUtil = instance;
      this.token = token
    },
    async loginFinish(withUpdate) {
      this.showLogin = false;
      if (withUpdate) {
        let res = await getText(`${originPrefix}/json/config.json`);
        if (res[0]) {
          this.$emit('updateConfig', JSON.parse(res[1]))
          this.$message.success('从服务器获取配置成功!')
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
      }
      this.$message.success('保存成功!')
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.back-end {
  width: 100%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  $menu-width: 9rem;

  > .menu {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: $menu-width;
    background: rgba(43, 43, 48, 0.92);
    flex-direction: column;
    box-shadow: 0 0 0.8rem rgba(75, 75, 75, 0.5);
    z-index: $z-index-body+1;
    transition: all .2s ease-out;

    &.hide {
      transform: translateX(-100%);

      ~ .body {
        width: 100%;
      }
    }

    > .pendant {
      position: absolute;
      top: 0;
      left: 100%;
      flex-direction: column;
      background: black;

      > .toggle-menu, > .home {
        width: 2.2rem;
        height: 2.2rem;
      }

      > .toggle-menu {
        > svg {
          box-shadow: 0 0 0.4rem #00000063;
          cursor: pointer;
          transition: background .1s linear;

          &:hover {
            background: #1e1e1e;
          }

          > .line {
            fill: none;
            stroke: #00ffff;
            stroke-width: 6;
            transition: stroke-dasharray .4s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset .4s cubic-bezier(0.4, 0, 0.2, 1);
            @each $i, $n in (1, 207), (2, 60), (3, 207) {
              &.line#{$i} {
                stroke-dasharray: 60 $n;
              }
            }
          }
        }

        @each $i, $n, $s in (1, -134, 90 207), (2, -30, 1 60), (3, -134, 90 207) {
          &.opened > svg > .line#{$i} {
            stroke-dasharray: $s;
            stroke-dashoffset: $n;
          }
        }
      }
    }

    > .item {
      font-size: 1rem;
      color: black;
      text-decoration: none;
      justify-content: center;
      padding: 1rem 0;
      width: calc(100% - 0.2rem);
      border-left: 0.2rem solid transparent;

      &.active {
        background: rgb(31, 31, 31, 0.87);
        border-color: #5fff88;
      }

      &:not(.active):hover {
        background: rgba(255, 255, 255, 0.15);
      }

      > .icon {
        width: 2.2rem;
        height: 2.2rem;
        display: flex;

        > svg {
          width: 100%;
          height: 100%;
        }
      }

      > .name {
        margin-left: 1rem;
        color: white;
      }
    }

    > .home {
      margin-top: auto;
      width: 3rem;
      height: 3rem;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transition: all .15s ease-out;
      }
      &:hover{
        >img{
          box-shadow: 0 0 0.8rem rgba(255, 255, 255, 0.5);
        }
      }
    }
    ::v-deep .loading-button {
      background: #ac60ff;
      margin: 1rem 0;

      &:hover {
        background: #8c8e8d;
      }

      &.loading {
        background: #8c8e8d;
      }
    }
  }

  > .body{
    position: absolute;
    width: calc(100% - #{$menu-width});
    height: 100%;
    overflow-y: auto;
    right: 0;
    top: 0;
    align-items: flex-start;
    transition: all .2s ease-out;
    > div{
      background: white;
      width: calc(100% - 4rem);
      overflow: hidden;
      margin: 1rem 1rem 1rem 3rem;
      border-radius: 0.6rem;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    }
  }
  ::v-deep .check-box{
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    border: 1px solid gray;
    border-radius: 50%;
    &.active{
      background: #ff3700;
    }
  }
  ::v-deep .single-button.del-btn{
    border-radius: 0.2rem;
    background: #ff344f;
    width: 2.4rem;
    margin: 0 0.5rem;
    &:not(.disabled):hover{
      background: #f1314a;
    }
  }
  ::v-deep .init-load{
    width: 100%;
    margin-top: 2rem;
    justify-content: center;
    >svg{
      width: 5rem;
      height: 5rem;
    }
  }
  @include media{
    >.menu{
      background: rgba(43, 43, 48, 0.75);
    }
    >.body{
      width: 100%;
      >div{
        width: 99% !important;
        margin-left: 0.5% !important;
      }
    }
  }
}
</style>