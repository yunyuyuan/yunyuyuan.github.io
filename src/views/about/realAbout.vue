<template>
  <div class="about" flex>
    <p>Hello there,Geeker.</p>
    <span>Maybe you want to check <a :href="siteConfig.aboutUrl">this</a>.</span>
  </div>
</template>

<script>
import siteConfig from '@/site-config'
import {loadFinish} from "@/utils/utils";

export default {
  name: "realAbout",
  data() {
    return{
      siteConfig
    }
  },
  mounted() {
    loadFinish()
  }
}
</script>

<style scoped lang="scss">
.about{
  flex-direction: column;
  font-size: 1rem;
  width: 99%;
  height: 99%;
  justify-content: center;
  background: linear-gradient(45deg, #ffcfda, #71e5ffb5);
  p{

  }
  span{

  }
  a{

  }
}
</style>