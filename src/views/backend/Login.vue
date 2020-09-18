<template>
    <div class="login" @click.self="$emit('hide')">
        <div class="inner">
            <div class="head">
                <svg-icon :name="'backend'"/>
                <b>后台管理账户</b>
            </div>
            <div class="body">
              <div v-for="(v,k) in login" :key="k">
                <float-input :name="k" @input="input" :id="k" :size="1" :value="v"/>
                <span :class="{err: true, show: !login[k]}" title="请填写此字段">
                  <svg-icon :name="'warning'"/>
                </span>
              </div>
            </div>
            <div class="btn">
              <single-button class="exit" :text="'取消'" @click="exit"/>
              <single-button :class="{save: true, disabled: !allInputed}" :text="'保存'" @click="save"/>
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
            name: 'yunyuyuan',
            repo: 'yunyuyuan.github.io',
            email: '326178275@qq.com'
          }
        }
      },
      computed: {
        allInputed() {
          for (let k in this.login) {
            if (!this.login[k]) {
              return false
            }
          }
          return true
        }
      },
      methods: {
        exit() {
          this.$emit('hide')
        },
        save() {
          if (!this.allInputed) return
          this.$store.commit('updateGitUtil', new GithubUtils(
              this.login.token,
              this.login.name,
              this.login.repo,
                    {
                      name: this.login.name,
                      email: this.login.email
                    }
                ));
              this.$emit('save')
            },
        input(payload) {
          this.login[payload[0]] = payload[1]
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
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: $z-index-dialog;
        background: rgba(0, 0, 0, 0.4);
        justify-content: space-around;
        > .inner {
          background: #ebebeb;
          border-radius: 1rem;
          flex-direction: column;
          box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.4);
          border: 1px solid #939393;

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

                  > svg {
                    width: 1.2rem;
                    height: 1.2rem;
                  }
                }
              }
            }
            > .btn {
              margin: 1rem 0;

              ::v-deep > .single-button {
                background: #ff5d36;
                margin: 0 1rem;

                &:hover {
                  background: #dc512f;
                }

                &.save {
                  background: #004fff;

                  &:hover {
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