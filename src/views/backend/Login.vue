<template>
    <div class="login" @click.self="$emit('hide')">
        <div class="inner">
            <div class="head">
                <svg-icon :name="'backend'"/>
                <b>后台管理账户</b>
            </div>
            <div class="body">
                <div v-for="(v,k) in login" class="input-container">
                    <input :class="{inputed: v!==''}" :id="`login-${k}`" v-model="login[k]"/>
                    <label :for="`login-${k}`">{{ k }}</label>
                    <div class="bar"></div>
                </div>
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

    export default {
        name: "Login",
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
            > .body{
                flex-direction: column;
                width: 100%;
                margin: 0.8rem 0;
                .input-container{
                    position: relative;
                    margin: 1rem 0;
                    width: 60%;
                    input{
                        outline: none;
                        z-index: 1;
                        position: relative;
                        background: none;
                        width: 100%;
                        height: 2rem;
                        border: 0;
                        color: #212121;
                        font-size: 0.95rem;
                        font-weight: 400;
                        &:focus, &.inputed{
                            ~ label{
                                color: #9d9d9d;
                                transform: translate(-12%, -70%) scale(0.75);
                            }
                        }
                        &:focus{
                            ~ .bar{
                                &:before,
                                &:after{
                                    width: 50%;
                                }
                            }
                        }
                    }
                    label{
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: #9e9e9e;
                        font-size: 1.4rem;
                        line-height: 2rem;
                        transition: all .2s ease;
                    }
                    .bar{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        background: #757575;
                        width: 100%;
                        height: 1px;
                        &:before,
                        &:after{
                            content: '';
                            position: absolute;
                            background: #007aff;
                            width: 0;
                            height: 2px;
                            transition: .2s ease;
                        }
                        &:before{
                            left: 50%;
                        }
                        &:after{
                            right: 50%;
                        }
                    }
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