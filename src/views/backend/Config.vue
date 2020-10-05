<template>
  <div class="config" flex>
    <div class="head" flex>
      <svg-icon :name="'config'"/>
      <b>修改配置信息</b>
    </div>
    <div class="list" flex>
      <float-input v-for="k in keys" :name="k" :value="config[k]||''" :id="k" :size="1" @input="input"/>
    </div>
    <loading-button :loading="updating" :text="'上传'" :icon="'save'" @click.native="commitConfig"/>
  </div>
</template>

<script>
import {mapState} from "vuex";
import FloatInput from "@/components/FloatInput";
import {parseAjaxError} from "@/utils";
import LoadingButton from "@/components/LoadingButton";

export default {
  name: "Config",
  components: {LoadingButton, FloatInput},
  data() {
    return {
      updating: false,
      keys: ["name", "describe", "copyright", "github", "bilibili", "email"]
    }
  },
  computed: {
    ...mapState(['config', 'gitUtil'])
  },
  methods: {
    input(payload) {
      this.config[payload[0]] = payload[1]
    },
    async commitConfig() {
      if (this.gitUtil) {
        this.updating = true;
        // 更新config.json
        let res = await this.gitUtil.updateConfig(this.config);
        this.updating = false;
        if (res[0]) {
          this.$message.success('更新成功!')
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.config{
  flex-direction: column;
  margin: 2rem auto 0 auto !important;
  width: 40rem !important;
  > .head{
    padding: 0.6rem 0;
    width: 100%;
    border-radius: 0.6rem 0.6rem 0 0;
    background: linear-gradient(to bottom, #686868, #3b3b3b);
    border-bottom: 1px solid #cecece;
    justify-content: center;
    > svg{
      width: 2.2rem;
      height: 2.2rem;
    }

    > b {
      margin-left: 1rem;
      font-size: 1.1rem;
      color: white;
    }
  }

  > .list {
    width: 100%;
    flex-direction: column;
    margin-top: 1rem;

    > .float-input {
      width: 60%;
      margin: 1rem 0;
    }
  }
  ::v-deep > .loading-button{
    margin: 1rem 0;
    padding: 0.3rem 0.8rem;
    background: #54b361;
    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
    &:not(.loading):hover{
      background: #61d671;
    }
    &.loading{
      background: gray;
      color: white;
    }
  }
}
</style>