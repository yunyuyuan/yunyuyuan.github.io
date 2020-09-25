<template>
  <div class="comment" flex>
    <write-comment/>
    <list-comment/>
  </div>
</template>

<script>
import WriteComment from "@/views/comment/Write";
import ListComment from "@/views/comment/List";
export default {
  name: "TheComment",
  components: {ListComment, WriteComment}
}
</script>

<style scoped lang="scss">
.comment{
  background: white;
  flex-direction: column;
  padding: 1rem 0;
}
</style>