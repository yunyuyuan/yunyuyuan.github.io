<template>
  <div class="detail" flex>
    <aside class="info">

    </aside>
    <div class="content">
      <span class="--markdown" v-html="html"></span>
    </div>
  </div>
</template>

<script>
import {getText} from "@/utils";
import {staticFolder} from "@/main";

export default {
  name: "Detail",
  data() {
    return {
      id: '',
      html: ''
    }
  },
  async created() {
    this.id = this.$route.params.id;
    await this.getHtml()
  },
  methods: {
    async getHtml() {
      let res = await getText(`${staticFolder}/md/${this.id}/index.html`);
      if (res[0]) {
        this.html = res[1]
      } else {
        this.$message.error(`获取文章失败: ${res[1]}`);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.detail{
  width: 100%;
  min-height: 100%;
  > .info{
  }
  > .content{
    width: 100%;
    > .--markdown{
      width: 100%;
    }
  }
}
</style>