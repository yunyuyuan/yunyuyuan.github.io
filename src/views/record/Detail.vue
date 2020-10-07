<template>
  <div class="record-detail" v-if="info.hasOwnProperty('images')" is-dialog @click.self="$emit('close')">
    <div class="inner">
      <div class="image" flex>
        <loading-img v-for="i in info.images" :src="i"/>
      </div>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
import LoadingImg from "@/components/LoadingImg";
import {getText, parseAjaxError} from "@/utils";
import {originPrefix} from "@/main";

export default {
  name: "Detail",
  components: {LoadingImg},
  props: {
    info: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    async info() {
      let res = await getText(`${originPrefix}/record/${this.info.file}.txt`);
      if (res[0]) {
        this.text = res[1]
      } else {
        this.$message.error(parseAjaxError(res[1]))
        this.text = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.record-detail{
  > .inner{
    width: 80%;
    height: 90%;
    overflow-y: auto;
    > .image{
      width: 100%;
      flex-wrap: wrap;
      ::v-deep .loading-img{
        width: calc(50% - 2rem) !important;
        height: 15rem !important;
        margin: 1rem;
        &:not(:last-of-type){
          border-bottom: 1px solid white;
        }
        img{
          object-fit: contain;
        }
      }
    }
    > span{
      width: 95%;
      font-size: 0.95rem;
      margin: 1rem 0 5rem 0;
      white-space: pre-wrap;
    }
  }
}
</style>