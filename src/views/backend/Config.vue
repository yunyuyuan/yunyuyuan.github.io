<template>
  <div class="config" flex>
    <div class="head" flex>
      <svg-icon :name="'config'"/>
      <b>修改配置信息</b>
    </div>
    <div class="list" flex>
      <float-input v-for="k in keys" :name="k" :value="info[k]||''" :id="k" :size="1" :isArea="k==='describe'" @input="input"/>
      <label flex>
        <span :class="{active: info.backgroundImg==='img'}" @click="changeBg('img')">图片背景</span>
        <span :class="{active: info.backgroundImg==='color'}" @click="changeBg('color')">彩色背景</span>
        <span :class="{active: info.backgroundImg==='random'}" @click="changeBg('random')">随机</span>
      </label>
    </div>
    <loading-button :loading="updating" :text="'上传'" :icon="'save'" @click.native="commitConfig"/>
  </div>
</template>

<script>
import FloatInput from "@/components/FloatInput";
import {parseAjaxError} from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";

export default {
  name: "Config",
  components: {LoadingButton, FloatInput},
  data() {
    return {
      updating: false,
      info: {},
      keys: ["name", "describe", "copyright", "github", "bilibili", "email"],
    }
  },
  computed: {
    config (){
      return this._config()
    },
    gitUtil (){
      return this._gitUtil()
    }
  },
  created() {
    this.info = JSON.parse(JSON.stringify(this.config));
  },
  inject: ['_config', '_gitUtil'],
  methods: {
    input(payload) {
      this.info[payload[0]] = payload[1];
    },
    changeBg (v){
      this.info.backgroundImg = v;
    },
    async commitConfig() {
      if (this.gitUtil) {
        this.updating = true;
        // 更新config.json
        for (let k of this.keys) {
          this.config[k] = this.info[k]
        }
        this.config.backgroundImg = this.info.backgroundImg;
        let res = await this.gitUtil.updateJsonFile(`config.json`, this.config);
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
@import "src/assets/style/public";

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
    > label{
        margin: 0.5rem 0;
        width: 60%;
        > span{
          cursor: pointer;
          font-size: 0.85rem;
          background: #b9b9b9;
          border-radius: 0.2rem;
          padding: 0.3rem 0.8rem;
          margin: 0 0.5rem;
          color: black;
          transition: all .15s linear;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
          &:hover{
            border-color: rgba(0, 0, 0, 0.4);
          }
          &.active{
            background: #1b00ff;
            color: white;
          }
        }
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
  @include media{
    width: 99% !important;
    .float-input {
      width: 95% !important;
    }
    label{
      width: 90% !important;
    }
  }
}
</style>