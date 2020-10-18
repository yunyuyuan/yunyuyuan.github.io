<template>
  <div class="about">
    <div class="text">
      <AnimateRotate :text="text"/>
    </div>
  </div>
</template>

<script>
import AnimateRotate from "@/views/about/AnimateRotate";
import {loadFinish} from "@/utils/utils";
export default {
  name: "index",
  components: {AnimateRotate},
  data (){
    return {
      text: 'simple code,simple life'
    }
  },
  mounted() {
    loadFinish()
  }
}
</script>

<style scoped lang="scss">
.about{
  >.text{
    background: white;
    padding: 1rem;
  }
}
</style>