<template>
  <div class="index">
    <blog-list/>
    <the-content/>
    <the-footer/>
  </div>
</template>

<script>
import BlogList from "@/views/block/BlogList";
import TheContent from "@/views/block/Content";
import TheFooter from "@/views/block/Footer";

export default {
  name: "index",
  components: {BlogList, TheContent, TheFooter}
}
</script>

<style scoped lang="scss">

</style>