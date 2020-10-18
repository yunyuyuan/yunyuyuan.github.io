<template>
  <div class="animate" flex>
    <span v-for="(i,idx) in textList" :style="{animationDelay: 0.05*idx+'s'}">
      {{ i }}
    </span>
  </div>
</template>

<script>
export default {
  name: "AnimateRotate",
  props: {
    text: {
      default: ''
    }
  },
  computed: {
    textList() {
      return this.text.split('')
    }
  }
}
</script>

<style scoped lang="scss">
.animate{
  padding: 1.8rem 0;
  @keyframes text-rotate{
    0%{
      transform: rotateX(-90deg);
    }
    10%{
      transform: rotateX(8deg);
    }
    15%, 90%{
      transform: rotateX(0);
    }
    100%{
      transform: rotateX(90deg);
    }
  }
  > span{
    font-size: 1.8rem;
    margin: 0 0.1rem;
    animation-name: text-rotate;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    transform-origin: 50% 50% 1.8rem;
    transform: rotateX(-90deg);
  }
}
</style>