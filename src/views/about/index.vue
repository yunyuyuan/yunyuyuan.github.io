<template>
  <div class="about">
    <div class="text" @click="toggleComp">
      <component :is="randomComp" :text="text"/>
    </div>
  </div>
</template>

<script>
import {loadFinish} from "@/utils/utils";
const siteConfig = require( '@/site-config');

import AnimateRotate from "@/views/about/AnimateRotate";
import AnimateGlitch from "@/views/about/AnimateGlitch";
import AnimateRainbow from "@/views/about/AnimateRainbow";
import AnimateFlow from "@/views/about/AnimateFlow";
import AnimateRun from "@/views/about/AnimateRun";
const comps = [AnimateRun, AnimateFlow, AnimateRainbow, AnimateGlitch, AnimateRotate];

export default {
  name: "index",
  data (){
    return {
      comps: comps,
      text: siteConfig.corner,
      idx: Math.floor(Math.random()*comps.length)
    }
  },
  computed: {
    randomComp (){
      return this.comps[this.idx]
    }
  },
  mounted() {
    loadFinish()
  },
  methods: {
    toggleComp (){
      this.idx = (this.idx+1)%this.comps.length;
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.about{
  >.text{
    background: white;
    padding: 0.5rem 1.5rem;
    border-radius: 0.2rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);
    margin: 2rem 0 1rem 0;
    >.animate{
      padding: 1rem 0;
      flex-wrap: wrap;
    }
    ::v-deep span.text{
      font-size: 1.8rem;
      font-weight: bold;
      white-space: pre-line;
    }
  }
  @include media{
    width: 98%;
  }
}
</style>