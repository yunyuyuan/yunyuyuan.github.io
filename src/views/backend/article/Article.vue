<template>
  <router-view :md="md" :inited="inited" @refresh="refreshMd"></router-view>
</template>

<script>
export default {
  name: "Article",
  data (){
    return {
      inited: false,
      md: []
    }
  },
  computed: {
    getMdList (){
      return this._needMdToRef()
    }
  },
  inject: ['_needMdToRef'],
  async created() {
    this.getMdList.then(res=>{
      this.md = res
    })
    this.inited = true
  },
  methods: {
    async refreshMd() {
      this.inited = false;
      this._needMdToRef(true).then(res=>{
        this.md = res;
      })
      this.inited = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>