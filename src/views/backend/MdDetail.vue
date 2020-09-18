<template>
  <div class="md-detail">

  </div>
</template>

<script>
export default {
  name: "MdDetail",
  data (){
    return {
      id: 0
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {
    getInfo (){

    }
  }
}
</script>

<style scoped lang="scss">
.md-detail{

}
</style>