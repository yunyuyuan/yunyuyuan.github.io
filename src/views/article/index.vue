<template>
  <div class="article">
    <component :is="is" :id="id" :md="md"/>
  </div>
</template>

<script>
import {queryMap} from "@/route";
import {getText} from "@/utils";
import {originPrefix} from "@/need";

const List = ()=>import('./List')
const Detail = ()=>import('./Detail')

export default {
  name: "index",
  data() {
    return {
      md: []
    }
  },
  computed: {
    id (){
      return queryMap().id
    },
    is (){
      if (this.id){
        return Detail
      }
      return List
    }
  },
  async created() {
    let res = await getText(`${originPrefix}/json/md.json`);
    if (res[0]) {
      this.md = JSON.parse(res[1])
    }
    if (this.id){
      document.head.querySelector('#markdown-stylesheet').href = `${originPrefix}/markdown.css?ran=${new Date().getTime()}`
    }
  }
}
</script>

<style scoped lang="scss">
.article {
  width: 100%;
  min-height: 100%;
  position: relative;
  flex-shrink: 0;
}
</style>