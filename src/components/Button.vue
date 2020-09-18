<template>
  <div class="single-button" @click="$emit('click')">
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "SingleButton",
  props: ['text']
}
</script>

<style scoped lang="scss">
.single-button {
  padding: 0.2rem 0.8rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all .1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);

  > span {
    font-size: 0.9rem;
    color: white;
  }
}
</style>