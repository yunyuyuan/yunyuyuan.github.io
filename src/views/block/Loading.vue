<template>
  <transition name="fade">
    <div v-show="loading" class="loading" flex>
      <svg-icon :name="'loading'"/>
    </div>
  </transition>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Loading",
  data() {
    return {}
  },
  computed: {
    ...mapState(['loading'])
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index-loading;
  background: transparent;
  justify-content: center;
  transition: box-shadow 1s;
  box-shadow: 0 0 25vh 50vw rgba(255, 255, 255, 0.9) inset;
  &.fade-enter, &.fade-enter-to, &.fade-leave{
    box-shadow: 0 0 25vh 50vw rgba(255, 255, 255, 0.9) inset;
  }
  &.fade-leave-to{
    box-shadow: 0 0 25vh -10vh rgba(255, 255, 255, 0.9) inset;
  }
  > svg{
    width: 4rem;
    height: 4rem;
  }
}
</style>