<template>
  <div class="back-end">
      <div class="menu">
          <router-link v-for="item in menu" :key="item.name" :to="{name: item.pathName}"
                       :class="{active: $route.name.indexOf(item.pathName)===0}">
        <span class="icon">
          <svg-icon :name="item.icon"/>
        </span>
            <span class="name">{{ item.name }}</span>
          </router-link>
        <div :class="{loading: updating}" class="btn update" @click="updateConfig">
          <svg-icon :name="updating?'loading':'update'"/>
          <span>更新</span>
        </div>
        <div class="btn login" @click="showLogin = true">
          <svg-icon :name="'account'"/>
          <span>登录</span>
        </div>
      </div>
    <login v-show="showLogin" @save="login" @hide="showLogin = false"/>
    <div class="body">
      <keep-alive>
        <router-view @login="showLogin = true"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
    import Login from "./Login";
    import {getText} from "@/utils";

    export default {
        name: "index",
        components: {Login},
      data() {
            return {
                showLogin: false,
              updating: false,
                menu: [
                    {
                        name: '配置',
                        pathName: 'backend.config',
                        icon: 'config'
                    },
                    {
                        name: '文章',
                        pathName: 'backend.md',
                        icon: 'article'
                    }
                ]
            }
        },
        methods: {
          login (){
            this.showLogin = false;
            this.updateConfig()
          },
          updateConfig() {
            if (this.updating) return
            this.updating = true
            getText('/config.json').then(res => {
              if (res[0]) {
                this.$store.commit('updateConfig', JSON.parse(res[1]))
              }
              setTimeout(() => {
                this.updating = false
              }, 5000)
            })
          },
        }
    }
</script>

<style scoped lang="scss">
.back-end {
  width: 100%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  $menu-width: 9rem;

  > .menu{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: $menu-width;
    background: rgba(43, 43, 48, 0.92);
    flex-direction: column;
    box-shadow: 0 0 0.8rem rgba(75, 75, 75, 0.5);
    > a{
      font-size: 1rem;
      color: black;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
            padding: 1rem 0;
            width: calc(100% - 0.2rem);
            border-left: 0.2rem solid transparent;
            &.active{
                background: rgb(31, 31, 31, 0.87);
                border-color: #5fff88;
            }
            &:not(.active):hover{
                background: rgba(255, 255, 255, 0.15);
            }
            > .icon{
                width: 2.2rem;
                height: 2.2rem;
                display: flex;
                > svg{
                    width: 100%;
                    height: 100%;
                }
            }
            > .name{
                margin-left: 1rem;
                color: white;
            }
        }
        > .btn{
            background: #ac60ff;
            color: white;
            padding: 0.2rem 0.8rem;
            border-radius: 0.3rem;
            margin: 0 0 1rem 0;
            cursor: pointer;
            transition: all .1s linear;
          &.update{
            background: #4a91ff;
            margin: auto 0 1rem 0;
          }
            &:hover{
                background: #8c8e8d;
            }

          &.loading{
            cursor: not-allowed;
            background: #8c8e8d;
            > svg{
              animation: rotating 2s linear infinite;
            }
          }
          > svg {
            width: 1.6rem;
            height: 1.6rem;
          }

          > span {
            font-size: 0.9rem;
            margin-left: 0.6rem;
          }
        }
  }

  > .body {
    position: absolute;
    width: calc(100% - #{$menu-width});
    height: 100%;
    overflow-y: auto;
    left: $menu-width;
    top: 0;
    align-items: flex-start;
  }
}
</style>