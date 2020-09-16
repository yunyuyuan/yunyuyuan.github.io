<template>
  <div class="login">
    <input v-model="token" placeholder="输入token"/>
    <input v-model="user" placeholder="输入user"/>
    <input v-model="email" placeholder="输入email"/>
    <input v-model="repo" placeholder="输入repo"/>
    <button @click="login">提交</button>
  </div>
</template>

<script>
import {githubUtils} from "@/utils";

export default {
  name: "Login",
  data() {
    return {
      token: 'cd799aa822c0f000443e418924cf9ba82b8d5962',
      user: 'yunyuyuan',
      repo: 'yunyuyuan.github.io',
      email: '326178275@qq.com'
    }
  },
  methods: {
    login() {
      this.$store.commit('initGitUtil', new githubUtils(
          this.token,
          this.user,
          this.repo,
          {
            name: this.user,
            email: this.email
          }
      ))
      this.$router.push({name: 'backEnd.config'})
    }
  }
}
</script>

<style scoped lang="scss">
.login {

}
</style>