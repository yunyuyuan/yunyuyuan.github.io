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
      <div class="pull" @click="updateConfig">
        <span>拉取</span>
      </div>
      <div class="push" @click="commitConfig">
        <span>提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import FloatInput from "@/components/FloatInput";

export default {
  name: "Config",
  components: {FloatInput},
  data() {
    return {
      login: false,
      config: {},
      keys: ["name", "describe", "copyright", "github", "bilibili", "email"]
    }
  },
  computed: {
    ...mapState(['gitUtil'])
  },
  watch: {
    '$store.gitUtil': function () {
      console.log('update')
    }
  },
  created() {
    this.updateConfig()
  },
  methods: {
    updateConfig() {
      if (!this.gitUtil) {
        this.login = false
      } else {
        this.gitUtil.getFile('public/config.json').then(res => {
          if (res[0]) {
            this.config = JSON.parse(decodeURIComponent(escape(atob(res[1].data.content))))
            console.log(this.config)
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
    }
  }
}
</script>

<style scoped lang="scss">
.config {
  flex-direction: column;
  background: white;
  border-radius: 0.6rem;
  margin: auto;
  box-shadow: 0 0 2rem rgba(111, 100, 100, 0.53);

  > .head {
    padding: 0.6rem 20rem;
    border-radius: 0.6rem 0.6rem 0 0;
    background: linear-gradient(to bottom, #d9fffb, #c0fffa);
    border-bottom: 1px solid #cecece;

    > svg {
      width: 2.4rem;
      height: 2.4rem;
    }

    > b {
      font-size: 1.1rem;
    }
  }

  > .list {
    flex-direction: column;

    > .float-input {
      margin: 1rem 0;
    }
  }

  > .btn {
    margin: 1rem 0;

    > div {
      padding: 0.3rem 0.8rem;
      background: #3591c3;
      margin: 0 1rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      cursor: pointer;

      &.push {
        background: #499b54;
      }

      > svg {

      }

      > span {
        font-size: 0.9rem;
        color: white;
      }
    }
  }
}
</style>