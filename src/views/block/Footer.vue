<template>
  <footer flex>
    <a href="/backend" class="favicon" flex title="后台管理">
      <img :src="`${originPrefix}/${siteConfig.avatar}?stamp=${siteConfig.timeStamp}`"/>
    </a>
    <div class="social-media" flex>
      <a v-for="k in links" :key="k" target="_blank" :href="config[k]" :title="k" flex>
        <svg-icon :name="k"/>
      </a>
    </div>
    <div class="copyright" flex>
      <span>Copyright (c) {{ config.copyright }} <b write-font>{{ config.name }}</b><b> | {{ domain }}</b></span>
      <span flex>All right reserved
        <a :href="`${isDev?'':'/dynamic'}/rss.xml`" target="_blank" title="rss订阅">
          <svg-icon :name="'rss'"/>
        </a>
      </span>
    </div>
  </footer>
</template>

<script>
import selfImage from '@/image/i.png';
import {originPrefix} from "@/need";
import siteConfig from '@/site-config'

export default {
  name: "Footer",
  data() {
    return {
      originPrefix,
      siteConfig,
      isDev: process.env.NODE_ENV==='development',
      selfImage,
      links: ['github', 'bilibili', 'email']
    }
  },
  computed: {
    domain() {
      return location.hostname
    },
    config (){
      return this._config()
    }
  },
  inject: ['_config']
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

@keyframes shine{
  0%{
    box-shadow: 0 0 0 #00FFD9;
  }100%{
    box-shadow: 0 0 1.5rem #d900ff;
   }
}

footer{
  width: 100%;
  background: #2b2b2b;
  margin-top: auto;
  height: $footer-height;
  box-shadow: 0 0 1rem #020202;
  z-index: $z-index-footer;
  flex-shrink: 0;
  >.favicon {
    margin: 0 1.6rem;
    height: 3.5rem;
    width: 3.5rem;
    background: #cdcdcd;
    border-radius: 0.5rem;
    justify-content: center;
    transition: all .15s linear;
    flex-shrink: 0;
    &:hover{
      background: white;
      animation: shine 1s ease-out infinite alternate;
    }
    > img{
      height: 90%;
      width: 90%;
    }
  }
  > .social-media{
    > a{
      margin: 0 0.8rem;
      background: white;
      border-radius: 0.25rem;
      padding: 0.2rem 0.4rem;
      justify-content: center;
      transition: all .15s linear;
      &:hover{
        background: #e3e3e3;
        animation: shine 1s linear infinite alternate;
      }
      > svg{
        width: 1.4rem;
        height: 1.4rem;
      }
    }
  }
  >.copyright{
      height: 100%;
      justify-content: center;
      flex-direction: column;
      margin: 0 1rem 0 auto;
      > span {
        color: #bbbbbb;
        font-size: 0.8rem;
        margin: 0.5rem 0;

        > b {
          color: #ddd;
        }
        >a{
          text-decoration: none;
          margin-left: 1rem;
          width: 1.5rem;
          height: 1.5rem;
          @keyframes spinning-rotate{
            0%{
              transform: rotate(0);
            }
            70%{
              transform: rotate(360deg);
            }
            80%,90%{
              transform: rotate(390deg);
            }
            100%{
              transform: rotate(360deg);
            }
          }
          &:hover{
            animation: spinning-rotate .5s linear;
          }
          >svg{
            width: 100%;
            height: 100%;
          }
        }
      }
  }
  @include media{
    flex-wrap: wrap;
    padding: 1rem 0 0 0;
    height: unset;
    >.copyright{
      width: 100%;
      height: 3.6rem;
      margin: 0;
      justify-content: space-around;
      >span{
        margin: 0;
      }
    }
  }
}
</style>