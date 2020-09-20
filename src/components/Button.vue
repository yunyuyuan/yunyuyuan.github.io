<template>
  <div class="single-button">
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
    padding: 0.3rem 1rem;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: all .1s linear;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
    > span{
        font-size: 0.92rem;
        color: white;
    }
}
</style>