<template>
  <div>

  </div>
</template>

<script>
export default {
  name: "Md",
  data() {
    return {
      login: false
    }
  },
  created() {
    if (!this.gitUtil) {
      this.login = false
    } else {
      this.gitUtil.getFile('public/md').then(res => {
        if (res[0]) {
          decodeURIComponent(escape(atob(res[1].data.content)))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>