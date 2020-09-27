<template>
  <div class="comment" flex>
    <div class="token">

    </div>
    <write-comment @submit="submit" :loading="submitting"/>
    <list-comment :id="this.info.id"/>
  </div>
</template>

<script>
import WriteComment from "@/views/comment/Write";
import ListComment from "@/views/comment/List";
import {createComment} from "@/views/comment/utils";
import {parseAjaxError, parseMarkdown} from "@/utils";

export default {
  name: "TheComment",
  components: {ListComment, WriteComment},
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      submitting: false
    }
  },
  methods: {
    async submit(payload) {
      if (this.submitting) return;
      this.submitting = true;
      let res = await createComment({
        title: this.info.id,
        body: payload.text
      });
      if (res[0]) {
        this.$message.success('评论成功!')
      } else {
        this.$message.error(parseAjaxError(res[1]))
      }
      this.submitting = false;
    },
  }
}
</script>

<style scoped lang="scss">
.comment{
  background: white;
  flex-direction: column;
  padding: 1rem 0;
}
</style>