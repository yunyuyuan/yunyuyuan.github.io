<template>
  <div class="msg-board" flex>
    <div class="head" flex>
      <svg-icon name="comments"/>
      <h1>留言板</h1>
    </div>
    <the-comment :title="'msg-board'"/>
  </div>
</template>

<script>
import TheComment from "@/views/comment/index";
import { loadFinish} from "@/utils/utils";

export default {
  name: "index",
  components: {TheComment},
  mounted() {
    loadFinish()
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.msg-board{
  width: 90%;
  max-width: 60rem;
  margin: 1rem 0;
  flex-direction: column;
  flex-shrink: 0;
  > .head{
    width: 100%;
    margin-bottom: 1rem;
    background: #171717;
    box-shadow: 0 0 1rem rgba(255, 255, 255, 0.6);
    justify-content: center;
    padding: 0.6rem 0;
    border-radius: 0.2rem;
    > svg{
      width: 2.4rem;
      height: 2.4rem;
    }
    > h1{
      font-size: 1.15rem;
      margin-left: 1rem;
      color: white;
    }
  }
  ::v-deep .comment{
    width: 100%;
    > .list{
      order: -1;
      margin: 1rem 0;
      padding-top: 0;
      padding-bottom: 1rem;
      border-top: none;
      border-bottom: 2px solid gray;
    }
    > .write{
      margin-bottom: 1rem;
    }
  }
  @include media{
    width: 98%;
    ::v-deep .comment{
      >.write{
        width: 95%;
      }
    }
  }
}
</style>