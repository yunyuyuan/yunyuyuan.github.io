<template>
  <section class="the-head">
    <div class="body">
      <b class="txt">
        Simple Code,Simple Life
      </b>
    </div>
  </section>
</template>

<script>
export default {
  name: "BlogList",
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";
.the-head {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $head-height;
  background: transparent;
  z-index: $z-index-head;

  > .body {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;

    > .txt {
      margin: 0 1rem 0 auto;
      color: white;
    }
  }
}
</style>