<template>
  <span class="resizer" :resizing="resizing" :style="{cursor: `${isH?'ew':'ns'}-resize`}" @touchstart="startResize" @mousedown="startResize"></span>
</template>

<script>
export default {
  name: "Resizer",
  props: ['orient'],
  data (){
    return {
      resizing: false
    }
  },
  computed: {
    isH (){
      return this.orient === 'h'
    }
  },
  methods: {
    startResize (e){
      this.$emit('start', this.isH?(e.screenX||e.touches[0].screenX):(e.screenY||e.touches[0].screenY));
      let vue_ = this;
      document.body.setAttribute('unselectable', '');
      function resize(e) {
        e.stopPropagation();
        e.preventDefault();
        vue_.$emit('resize', vue_.isH?(e.screenX||e.touches[0].screenX):(e.screenY||e.touches[0].screenY))
      }

      function release() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('mouseup', release);
        document.removeEventListener('touchend', release);
        document.body.removeAttribute('unselectable');
        vue_.resizing = false;
      }

      this.resizing = true;
      document.addEventListener('mousemove', resize);
      document.addEventListener('touchmove', resize, { passive: false });
      document.addEventListener('mouseup', release)
      document.addEventListener('touchend', release)
    },
  }
}
</script>

<style scoped lang="scss">

</style>