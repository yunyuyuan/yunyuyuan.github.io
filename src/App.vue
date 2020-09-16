<template>
  <div id="app">
    <the-index/>
  </div>
</template>

<script>
import TheIndex from '@/views/index'

export default {
  name: 'App',
  components: {TheIndex},
  beforeCreate() {
    this.$store.commit('initConfig')
  }
}
</script>

<style lang="scss">
html, body{
  width: 100%;
  height: 100%;
  font-size: 16px;
}
#app{
  width: 100%;
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
}
div, section{
    display: flex;
    align-items: center;
}
input, textarea{
    outline: none;
}
</style>
