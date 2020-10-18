<template>
  <div class="img-zoomer">
    <div class="img">
      <img :src="src" alt="img"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImgZoomer",
  props: {
    src: {
      type: String,
      default: ''
    },
    pos: {
      type: Array,
      default: ()=>[0, 0]
    }
  }
}
</script>

<style scoped lang="scss">
.img-zoomer{

}
</style>