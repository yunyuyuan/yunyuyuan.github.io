<template>
  <svg aria-hidden="true">
    <use :xlink:href="getName"></use>
  </svg>
</template>

<script>
export default {
  name: "IconSvg",
  props: ['name'],
  computed: {
    getName () {
      return `#icon-${this.name}`
    },
  }
}
</script>

<style scoped lang="scss">

</style>