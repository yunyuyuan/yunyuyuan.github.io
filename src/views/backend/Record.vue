<template>
  <router-view :record="record" :inited="inited"></router-view>
</template>

<script>
import {getText} from "@/utils/utils";
import {originPrefix} from "@/need";

export default {
  name: "Record",
  data (){
    return {
      inited: false,
      record: []
    }
  },
  async created() {
    let res = await getText(`${originPrefix}/json/record.json`);
    if (res[0]){
      this.record = JSON.parse(res[1]);
    }
    this.inited = true
  },
}
</script>

<style scoped lang="scss">

</style>