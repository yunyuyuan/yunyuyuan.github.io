<template>
  <div class="record-detail" v-if="info.hasOwnProperty('images')" is-dialog @click.self="$emit('close')">
    <div class="inner">
      <a @click="$emit('close')">关闭</a>
      <div class="image" flex v-viewer>
        <loading-img v-for="i in info.images" :src="i" :data-viewer="true"/>
      </div>
      <div class="loading" v-if="text===''" flex>
        <svg-icon :name="'loading'"/>
      </div>
      <span v-else write-font>
        <time>{{info.time|time(false)}}</time>{{ text }}</span>
    </div>
  </div>
</template>

<script>
import LoadingImg from "@/components/LoadingImg";
import {getText, parseAjaxError} from "@/utils/utils";
import {originPrefix} from "@/need";

export default {
  name: "Detail",
  components: {LoadingImg},
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    async info() {
      if (!this.info.file) return;
      let res = await getText(`${originPrefix}/record/${this.info.file}.txt`);
      if (res[0]) {
        this.text = res[1]
      } else {
        this.$message.error(parseAjaxError(res[1]))
        this.text = ''
      }
    }
  },
  mounted() {
    document.querySelector('#index').append(this.$el)
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.record-detail{
  z-index: $z-index-record-detail;
  > .inner{
    width: 80%;
    height: 90%;
    overflow-y: auto;
    > .image{
      width: 100%;
      flex-wrap: wrap;
      ::v-deep .loading-img{
        width: calc(50% - 0.2rem) !important;
        height: unset !important;
        margin: 0.1rem;
        &:not(:last-of-type){
          border-bottom: 1px solid white;
        }
        img{
          object-fit: contain;
        }
      }
    }
    >.loading{
      width: 100%;
      justify-content: center;
      >svg{
        height: 3rem;
        width: 3rem;
      }
    }
    > span{
      width: 95%;
      border-top: 1px solid gray;
      font-size: 1.2rem;
      margin: 1rem 0 5rem 0;
      white-space: pre-wrap;
      padding-top: 0.8rem;
      font-weight: bold;
      position: relative;
      >time{
        position: absolute;
        right: 0;
        top: -0.5rem;
        background: white;
        font-size: 0.85rem;
        font-family: "Source Code Pro",serif;
        line-height: 1rem;
        color: #ff3b00;
      }
    }
    >a{
      display: none;
    }
  }
  @include media{
    >.inner{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      border-radius: 0;
      >a{
        cursor: pointer;
        display: flex;
        position: fixed;
        right: 0;
        top: 0;
        background: rgba(255, 0, 0, 0.6);
        color: white;
        padding: 0.3rem 1rem;
        font-size: 0.95rem;
        z-index: 2;
      }
    }
  }
}
</style>