<template>
  <div class="index">
    <the-head/>
    <section class="body">
      <the-content/>
      <the-footer/>
    </section>
  </div>
</template>

<script>
import TheHead from "@/views/block/Head";
import TheContent from "@/views/block/Content";
import TheFooter from "@/views/block/Footer";

export default {
  name: "index",
  components: {TheHead, TheContent, TheFooter},
  methods: {}
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.index {
  > .body {
    position: fixed;
    top: $head-height;
    width: 100%;
    height: calc(100% - #{$head-height});
    overflow-y: auto;
    z-index: $z-index-body;
    flex-direction: column;
  }
}
</style>