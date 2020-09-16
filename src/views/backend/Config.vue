<template>
  <div class="config">
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Config",
  data() {
    return {
      login: false
    }
  },
  computed: {
    ...mapState(['gitUtil'])
  },
  created() {
    if (!this.gitUtil) {
      this.login = false
    } else {
      this.gitUtil.getFile('public/config.json').then(res => {
        if (res[0]) {
          decodeURIComponent(escape(atob(res[1].data.content)))
        } else {
          console.log(res[1])
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