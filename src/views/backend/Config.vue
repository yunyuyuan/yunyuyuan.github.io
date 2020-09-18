<template>
  <div class="config">
    <div class="head">
      <svg-icon :name="'config'"/>
      <b>修改配置信息</b>
    </div>
    <div class="list">
      <float-input v-for="k in keys" :name="k" :value="config[k]||''" :id="k" @input="input"/>
    </div>
    <div class="btn">
      <single-button :text="'提交'" @click="commitConfig"/>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import FloatInput from "@/components/FloatInput";
import SingleButton from "@/components/Button";
import {getConfig} from "@/utils";

export default {
  name: "Config",
  components: {SingleButton, FloatInput},
  data() {
    return {
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
    commitConfig() {
      if (this.gitUtil) {
        this.gitUtil.updateFile('public/config.json', unescape(encodeURIComponent(JSON.stringify(this.config, null, 4))), '更新config').then(res => {
          if (res[0]) {

          } else {
            console.log(res[1])
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.config {
  flex-direction: column;
  background: #f7f7f7;
  border-radius: 0.6rem;
  margin: 2rem auto 0 auto;
  box-shadow: 0 0 2rem rgba(111, 100, 100, 0.53);
  width: 40rem;

  > .head {
    padding: 0.6rem 0;
    width: 100%;
    border-radius: 0.6rem 0.6rem 0 0;
    background: linear-gradient(to bottom, #686868, #3b3b3b);
    border-bottom: 1px solid #cecece;
    justify-content: center;

    > svg {
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

    > .float-input {
      width: 60%;
      margin: 1rem 0;
    }
  }

  > .btn {
    margin: 1rem 0;

    ::v-deep > .single-button {
      margin: 0 1rem;
      background: #499b54;

      &:hover {
        background: #5ece6d;
      }
    }
  }
}
</style>