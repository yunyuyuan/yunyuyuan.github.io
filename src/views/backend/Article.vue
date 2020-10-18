<template>
  <router-view :md="md"></router-view>
</template>

<script>
import {getText} from "@/utils/utils";
import {originPrefix} from "@/need";

export default {
  name: "Article",
  data (){
    return {
      md: []
    }
  },
  async created() {
    let res = await getText(`${originPrefix}/json/md.json`);
    if (res[0]){
      this.md = JSON.parse(res[1])
    }
  },
}
</script>

<style scoped lang="scss">

</style>