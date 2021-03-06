<template>
  <top-dialog class="record-detail" v-if="info.hasOwnProperty('images')" @click.native.self="$emit('close')">
    <a @click="$emit('close')">关闭</a>
    <div class="image" flex v-viewer>
      <loading-img v-for="i in info.images" :src="i" :data-viewer="true"/>
    </div>
    <div class="loading" v-if="loading" flex>
      <svg-icon name="loading"/>
    </div>
    <span v-else write-font>
      <svg-icon name="text"/>
      <time>{{info.time|time(false)}}</time>{{ text }}
    </span>
  </top-dialog>
</template>

<script>
import LoadingImg from "@/components/LoadingImg";
import {getText, parseAjaxError} from "@/utils/utils";
import {originPrefix} from "@/need";
import TopDialog from "@/components/Dialog";

export default {
  name: "Detail",
  components: {TopDialog, LoadingImg},
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      text: ''
    }
  },
  watch: {
    async info() {
      if (!this.info.file) return;
      this.loading = true;
      const res = await getText(`${originPrefix}/record/${this.info.file}.txt`);
      if (res[0]) {
        this.text = res[1]
      } else {
        this.$message.error(parseAjaxError(res[1]))
        this.text = ''
      }
      this.loading = false;
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.record-detail{
  ::v-deep > .inner{
    width: 80%;
    height: 90%;
    flex-direction: column;
    border-radius: 0;
    > .image{
      width: 100%;
      flex-wrap: wrap;
      flex-shrink: 0;
      .loading-img{
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
      margin: 3rem 0;
      >svg{
        height: 5rem;
        width: 5rem;
      }
    }
    > span{
      width: 95%;
      border-top: 1px solid gray;
      font-size: 1.1rem;
      margin: 1rem 0 5rem 0;
      white-space: pre-wrap;
      padding-top: 1.5rem;
      font-weight: bold;
      position: relative;
      >svg{
        position: absolute;
        width: 2rem;
        height: 1.6rem;
        top: -0.8rem;
        left: 0.5rem;
        padding: 0 0.2rem;
        background: white;
      }
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
    ::v-deep >.inner{
      width: 100%;
      min-height: 100%;
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