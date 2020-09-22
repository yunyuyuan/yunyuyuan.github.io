<template>
  <div class="login" @click.self="$emit('hide')" is-dialog>
    <div class="inner">
      <div class="head" flex>
        <svg-icon :name="'backend'"/>
        <b>后台管理账户</b>
      </div>
      <div class="body" flex>
        <div v-for="(v,k) in login" :key="k" flex>
          <float-input :name="k" @input="input" :id="k" :size="1" :value="v"/>
          <span :class="{err: true, show: !login[k]}" title="请填写此字段">
                  <svg-icon :name="'warning'"/>
                </span>
        </div>
      </div>
      <div class="option">
        <label @click="remember = !remember">
          <a :class="{active: remember}"></a>
          <span>在本机上记住我</span>
                </label>
                <label @click="withUpdate = !withUpdate">
                    <a :class="{active: withUpdate}"></a>
                    <span>保存后立即更新配置</span>
                </label>
            </div>
      <div class="btn" flex>
        <single-button class="exit" :text="'取消'" @click.native="$emit('hide')"/>
        <single-button :class="{save: true, disabled: !allInputted}" :text="'保存'" @click.native="save"/>
      </div>
        </div>
    </div>
</template>

<script>
import {GithubUtils} from "@/utils";
import FloatInput from "@/components/FloatInput";
import SingleButton from "@/components/Button";

    export default {
        name: "Login",
        components: {SingleButton, FloatInput},
        data() {
            return {
                login: {
                    token: '',
                    name: '',
                    repo: '',
                    email: '',
                },
                remember: false,
                withUpdate: false
            }
        },
        created() {
            // 获取localStorage中配置
            this.login.token = localStorage.getItem('login-token') || '';
            this.login.name = localStorage.getItem('login-name') || '';
            this.login.repo = localStorage.getItem('login-repo') || '';
            this.login.email = localStorage.getItem('login-email') || '';
            if (this.login.token) {
                this.remember = true;
                this.commitUpdateGitutil();
            }
        },
        computed: {
          allInputted() {
            for (let k in this.login) {
              if (!this.login[k]) {
                return false
              }
            }
            return true
          }
        },
        methods: {
            save() {
              if (!this.allInputted) return;
              if (this.remember) {
                //存储到localStorage
                localStorage.setItem('login-token', this.login.token);
                localStorage.setItem('login-name', this.login.name);
                localStorage.setItem('login-repo', this.login.repo);
                localStorage.setItem('login-email', this.login.email);
              } else {
                // 删除localStorage
                localStorage.removeItem('login-token');
                localStorage.removeItem('login-name');
                    localStorage.removeItem('login-repo');
                    localStorage.removeItem('login-email');
                }
                this.commitUpdateGitutil();
                this.$emit('save', this.withUpdate)
            },
            commitUpdateGitutil() {
                this.$store.commit('updateGitUtil', new GithubUtils(
                    this.login.token,
                    this.login.name,
                    this.login.repo,
                    {
                        name: this.login.name,
                        email: this.login.email
                    }
                ));
            },
            input(payload) {
                this.login[payload[0]] = payload[1];
                if (payload[0] === 'name') {
                    this.login['repo'] = `${this.login['name']}.github.io`
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "src/assets/style/public";
    .login{
        > .inner {
        background: #efefef;
          > .head {
            background: white;
            padding: 0.6rem 10rem;
            border-radius: 1rem 1rem 0 0;
            justify-content: center;
            border-bottom: 1px solid gray;

            > svg {
              width: 2.4rem;
              height: 2.4rem;
            }
                > b{
                    margin-left: 2rem;
                    font-size: 1.08rem;
                }
            }
            > .body {
              flex-direction: column;
              width: 100%;
              margin: 0.8rem 0;

              > div {
                width: 100%;
                justify-content: center;

                > .float-input {
                  width: 60%;
                  margin: 1rem 0;
                }

                > .err {
                  margin-left: 1rem;
                  height: 0;
                  overflow: hidden;

                  &.show {
                      height: unset;
                  }
                    > svg{
                        width: 1.2rem;
                        height: 1.2rem;
                    }
                }
              }
            }
            > .option{
                width: 80%;
                flex-direction: column;
                align-items: flex-start;
                > label{
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    margin: 0.5rem 0;
                    &:hover{
                        > a{
                            border-color: red;
                        }
                    }
                    > a{
                        width: 1rem;
                        height: 1rem;
                        display: flex;
                        align-items: center;
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

                  &.disabled {
                    background: #5f5f5f !important;
                    cursor: not-allowed;
                  }
                }
              }
            }
        }
    }
</style>