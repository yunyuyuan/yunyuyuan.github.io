<template>
  <router-view :record="record" :inited="inited" @refresh="getRecord"></router-view>
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
    await this.getRecord()
  },
  methods: {
    async getRecord() {
      this.inited = false;
      let res = await getText(`${originPrefix}/json/record.json`);
      if (res[0]) {
        this.record = JSON.parse(res[1]);
      }
      this.inited = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>