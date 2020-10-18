<template>
  <router-view :record="record"></router-view>
</template>

<script>
import {getText} from "@/utils";
import {originPrefix} from "@/need";

export default {
  name: "Record",
  data (){
    return {
      record: []
    }
  },
  async created() {
    let res = await getText(`${originPrefix}/json/record.json`);
    if (res[0]){
      this.record = JSON.parse(res[1])
    }
  },
}
</script>

<style scoped lang="scss">

</style>