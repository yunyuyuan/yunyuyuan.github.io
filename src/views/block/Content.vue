<template>
  <div class="content">
    <div v-html="html" class="markdown"></div>
  </div>
</template>

<script>
const md = require('markdown-it')();

export default {
  name: "Content",
  data() {
    return {
      html: ''
    }
  },
  created() {
    this.downloadAndParse()
  },
  watch: {
    '$store.state.mdFile': function () {
      this.downloadAndParse()
    }
  },
  methods: {
    downloadAndParse() {
      fetch(window.location.origin + `/md/${this.$store.state.mdFile}.md`).then(res => {
        res.text().then(res => {
          this.html = md.render(res);
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  flex-direction: column;

  > .markdown {
    display: block;
    align-items: unset;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    position: relative;
    width: 80%;
    margin: 2rem 0;
  }
}
</style>