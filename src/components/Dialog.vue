<template>
  <transition name="dialog-fade">
    <div class="dialog">
      <div class="inner">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "TopDialog",
  props: {
    addToBody: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.addToBody){
      document.body.appendChild(this.$el);
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.dialog{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index-dialog;
  background: rgba(0, 0, 0, 0.4);
  justify-content: space-around;

  &, > .inner {
    display: flex;
    align-items: center;
  }

  > .inner {
    overflow-y: auto;
    background: white;
    border-radius: 1rem;
    flex-direction: column;
    box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.4);
    border: 1px solid #939393;
    max-height: 90%;
  }
}
</style>