<template>
  <div class="index">
    <the-head/>
    <the-content/>
    <the-footer/>
  </div>
</template>

<script>
import TheHead from "@/views/block/Head";
import TheContent from "@/views/block/Content";
import TheFooter from "@/views/block/Footer";

export default {
  name: "index",
  components: {TheHead, TheContent, TheFooter}
}
</script>

<style scoped lang="scss">

</style>