<template>
  <div class="login" @click.self="$emit('hide')" is-dialog>
    <div class="inner">
      <div class="head" flex>
        <svg-icon :name="'backend'"/>
        <b>后台管理账户</b>
      </div>
      <div class="body" flex>
        <float-input :name="'token'" @input="input" :id="'token'" :size="1" :value="token"/>
        <span :class="{err: true, show: !token}" title="请填写此字段">
                <svg-icon :name="'warning'"/>
              </span>
      </div>
      <div class="option">
        <label @click="remember = !remember" flex>
          <a :class="{active: remember}" flex></a>
          <span>在本机上记住我</span>
        </label>
        <label @click="withUpdate = !withUpdate" flex>
          <a :class="{active: withUpdate}" flex></a>
          <span>保存后立即更新配置</span>
        </label>
      </div>
      <div class="btn" flex>
        <single-button class="exit" :text="'取消'" @click.native="$emit('hide')"/>
        <single-button :class="{save: true, disabled: !token}" :text="'保存'" @click.native="save"/>
      </div>
    </div>
  </div>
</template>

<script>
import FloatInput from "@/components/FloatInput";
import SingleButton from "@/components/Button";
const siteConfig = require( '@/site-config')
import {GithubUtils} from "@/utils/githubApi";

export default {
  name: "Login",
  components: {SingleButton, FloatInput},
  data() {
    return {
      token: '',
      remember: false,
      withUpdate: false
    }
  },
  created() {
    // 获取localStorage中配置
    this.token = localStorage.getItem('login-token') || '';
    if (this.token) {
      this.remember = true;
      this.commitUpdateGitutil();
    }
  },
  methods: {
    save() {
      if (!this.token) return;
      if (this.remember) {
        //存储到localStorage
        localStorage.setItem('login-token', this.token);
      } else {
        // 删除localStorage
        localStorage.removeItem('login-token');
      }
      this.commitUpdateGitutil();
      this.$emit('save', this.withUpdate)
    },
    commitUpdateGitutil() {
      this.$emit('gitUtil', {
        instance: new GithubUtils(
            this.token,
            siteConfig.owner,
            siteConfig.repo,
            {
              name: siteConfig.owner,
              email: siteConfig.email
            }),
        token: this.token
      });
    },
    input(payload) {
      this.token = payload[1];
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/style/public";
.login{
  > .inner{
    background: #efefef;
    > .head{
      background: white;
      padding: 0.6rem 10rem;
      border-radius: 1rem 1rem 0 0;
      justify-content: center;
      border-bottom: 1px solid gray;
      > svg{
        width: 2.4rem;
        height: 2.4rem;
      }
      > b{
        margin-left: 2rem;
        font-size: 1.08rem;
      }
    }
    > .body{
      width: 100%;
      margin: 0.8rem 0;
      justify-content: center;
      > .float-input{
        width: 60%;
        margin: 1rem 0;
      }
      > .err{
        margin-left: 1rem;
        overflow: hidden;
        &.show{
          height: unset;
        }
        > svg{
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }
    > .option{
      width: 80%;
      flex-direction: column;
      align-items: flex-start;
      > label{
        cursor: pointer;
        margin: 0.5rem 0;
        &:hover{
          > a{
            border-color: red;
          }
        }
        > a{
          width: 1rem;
          height: 1rem;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid #252525;
          &:before{
            width: 100%;
            height: 100%;
            border-radius: inherit;
            content: '';
          }
          &.active{
            &:before{
              background: #ffca2e;
            }
          }
        }
        > span{
          font-size: 0.85rem;
          margin-left: 1rem;
        }
      }
    }
    > .btn{
      margin: 1rem 0;
      ::v-deep > .single-button{
        background: #808080;
        margin: 0 1rem;
        &:hover{
          background: #646464;
        }
        &.save{
          background: #004fff;
          &:hover{
            background: #0042d4;
          }
          &.disabled{
            background: #5f5f5f !important;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>