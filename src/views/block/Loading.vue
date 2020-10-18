<template>
  <div id="loading" flex>
    <svg-icon :name="'loading'"/>
  </div>
</template>

<script>

export default {
  name: "Loading",
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">
@import "src/assets/style/public";

#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index-loading;
  background: rgba(255, 255, 255, 0.9);
  justify-content: center;
  overflow: hidden;
  @keyframes hide-loading{
    0%{
      opacity: 1;
    }
    99%{
      opacity: 0;
      height: 100%;
    }100%{
      height: 0;
     }
  }
  &.hide.config-loaded{
    animation: hide-loading .4s ease-out forwards;
  }
  > svg {
    width: 4rem;
    height: 4rem;
  }
}
</style>