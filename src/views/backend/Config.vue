<template>
  <div class="config">
    <template v-if="!gitUtil">
      <div class="to-login">
        <span>请先<single-button :text="'登录'" @click="$emit('login')"/>后查看或编辑此内容</span>
      </div>
    </template>
    <template v-else>
      <div class="head">
        <svg-icon :name="'config'"/>
        <b>修改配置信息</b>
      </div>
      <div class="list">
        <float-input v-for="k in keys" :name="k" :value="config[k]||''" :id="k" @input="input"/>
      </div>
      <div class="btn">
        <single-button class="pull" :text="'拉取'" @click="updateConfig"/>
        <single-button class="push" :text="'提交'" @click="commitConfig"/>
      </div>
    </template>
  </div>
</template>

<script>
import {mapState} from "vuex";
import FloatInput from "@/components/FloatInput";
import SingleButton from "@/components/Button";

export default {
  name: "Config",
  components: {SingleButton, FloatInput},
  data() {
    return {
      config: {},
      keys: ["name", "describe", "copyright", "github", "bilibili", "email"]
    }
  },
  computed: {
    ...mapState(['gitUtil']),
  },
  watch: {
    '$store.state.gitUtil': function () {
      this.updateConfig()
    }
  },
  created() {
    this.updateConfig()
  },
  methods: {
    updateConfig() {
      if (this.gitUtil) {
        this.gitUtil.getFile('public/config.json').then(res => {
          if (res[0]) {
            this.config = JSON.parse(decodeURIComponent(escape(atob(res[1].data.content))))
          } else {
            console.log(res[1])
          }
        })
      }
    },
    input(payload) {
      this.config[payload[0]] = payload[1]
    },
    commitConfig() {
      if (this.gitUtil) {
        this.gitUtil.updateFile('public/config.json', unescape(encodeURIComponent(JSON.stringify(this.config))), '更新config').then(res => {
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
  background: white;
  border-radius: 0.6rem;
  margin: 2rem auto 0 auto;
  box-shadow: 0 0 2rem rgba(111, 100, 100, 0.53);
  width: 40rem;

  > .to-login {
    > span {
      display: flex;
      align-items: center;
      font-size: 1rem;

      > .single-button {
        margin: 0 0.5rem;
        background: #ff7245;

        &:hover {
          background: #d05c37
        }
      }
    }
  }

  > .head {
    padding: 0.6rem 0;
    width: 100%;
    border-radius: 0.6rem 0.6rem 0 0;
    background: linear-gradient(to bottom, #d9fffb, #c0fffa);
    border-bottom: 1px solid #cecece;
    justify-content: center;

    > svg {
      width: 2.2rem;
      height: 2.2rem;
    }

    > b {
      margin-left: 1rem;
      font-size: 1.1rem;
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
      background: #3591c3;
      margin: 0 1rem;

      &:hover {
        background: #45bdff;
      }

      &.push {
        background: #499b54;

        &:hover {
          background: #5ece6d;
        }
      }
    }
  }
}
</style>