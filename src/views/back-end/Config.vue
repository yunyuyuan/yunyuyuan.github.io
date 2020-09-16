<template>
  <div class="config">
    <button @click="submit">提交</button>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Config",
  data() {
    return {}
  },
  computed: {
    ...mapState(['gitUtil'])
  },
  created() {
    if (!this.gitUtil) {
      this.$router.push({name: 'backEnd.login'})
    } else {
      this.gitUtil.getFile('public/config.json').then(res => {
        if (res[0]) {
          decodeURIComponent(escape(atob(res[1].data.content)))
        }
      })
    }
  },
  methods: {
    submit() {
    }
  }
}
</script>

<style scoped lang="scss">
.config {

}
</style>