<template>
  <router-view :md="md" :inited="inited" @refresh="getMd"></router-view>
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
    await this.getMd()
  },
  methods: {
    async getMd() {
      this.inited = false;
      const res = await getText(`${originPrefix}/json/md.json`);
      if (res[0]) {
        this.md = JSON.parse(res[1])
      }
      this.inited = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>