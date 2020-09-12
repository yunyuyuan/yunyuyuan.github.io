<template>
  <div class="index">
    <the-head/>
    <section class="body">
      <router-view></router-view>
      <the-footer/>
    </section>
  </div>
</template>

<script>
import TheHead from "@/views/block/Head";
import TheFooter from "@/views/block/Footer";

export default {
  name: "index",
  components: {TheHead, TheFooter},
  methods: {}
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.index {
  height: 100%;
  width: 100%;
  > .body {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: $z-index-body;
    flex-direction: column;
  }
}
</style>