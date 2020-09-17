<template>
  <div class="icon-button" @click="$emit('click')">
    <svg-icon v-if="icon" :name="icon"/>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "IconButton",
  props: ['icon', 'text', 'style', 'background', 'color']
}
</script>

<style scoped lang="scss">
> .icon-button {
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 0.3rem;
  margin: auto 0 1rem 0;
  cursor: pointer;
  transition: all .1s linear;

  > svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  > span {
    font-size: 0.9rem;
    margin-left: 0.6rem;
  }
}
</style>