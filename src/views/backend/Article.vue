<template>
  <router-view :md="md" :inited="inited"></router-view>
</template>

<script>
import {getText} from "@/utils/utils";
import {originPrefix} from "@/need";

export default {
  name: "Article",
  data (){
    return {
      inited: false,
      md: []
    }
  },
  async created() {
    let res = await getText(`${originPrefix}/json/md.json`);
    if (res[0]){
      this.md = JSON.parse(res[1])
    }
    this.inited = true
  },
}
</script>

<style scoped lang="scss">

</style>