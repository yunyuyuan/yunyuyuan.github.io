<template>
  <div class="config">
    <button @click="submit">提交</button>
  </div>
</template>

<script>
export default {
  name: "Config",
  methods: {
    submit() {
      fetch('https://api.github.com/repos/yunyuyuan/yunyuyuan.github.io/git/ref/heads/master', {
        method: 'GET'
      }).then(res => {
        res.json().then(res => {
          console.log(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.config {

}
</style>