<template>
    <div class="login" @click.self="$emit('hide')">
        <div class="inner">
            <div class="head">
                <svg-icon :name="'backend'"/>
                <b>后台管理账户</b>
            </div>
            <div class="body">
              <float-input v-for="(v,k) in login" :name="k" @input="input" :id="k" :value="v"/>
            </div>
            <div class="btn">
                <span class="exit" @click="exit">取消</span>
                <span class="save" @click="save">保存</span>
            </div>
        </div>
    </div>
</template>

<script>
import {GithubUtils} from "@/utils";
import FloatInput from "@/components/FloatInput";

    export default {
      name: "Login",
      components: {FloatInput},
      data() {
        return {
          login: {
            token: 'cd799aa822c0f000443e418924cf9ba82b8d5962',
            name: 'yunyuyuan',
            repo: 'yunyuyuan.github.io',
            email: '326178275@qq.com'
          }
        }
      },
      methods: {
            exit() {
                this.$emit('hide')
            },
            save() {
                this.$store.commit('updateGitUtil', new GithubUtils(
                    this.login.token,
                    this.login.name,
                    this.login.repo,
                    {
                      name: this.login.name,
                      email: this.login.email
                    }
                ));
              this.$emit('hide')
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
        > .inner{
            background: #ebebeb;
            border-radius: 1rem;
            flex-direction: column;
            box-shadow: 0 0 1.5rem rgba(255, 255, 255, 0.3);
            border: 1px solid #4c4c4c;
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
            > .body {
              flex-direction: column;
              width: 100%;
              margin: 0.8rem 0;

              > .float-input {
                width: 60%;
                margin: 1rem 0;
              }
            }
            > .btn{
                margin: 1rem 0;
                > span{
                    background: #ff403b;
                    color: white;
                    border-radius: 0.2rem;
                    padding: 0.3rem 0.8rem;
                    font-size: 0.95rem;
                    margin: 0 1rem;
                    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    transition: all .1s ease-out;
                    &:hover{
                        transform: scale(1.05);
                    }
                    &.save{
                        background: #004fff;
                    }
                }
            }
        }
    }
</style>