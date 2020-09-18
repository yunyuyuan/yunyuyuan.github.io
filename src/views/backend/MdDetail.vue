<template>
  <div class="md-detail">
    <div class="head">
      <float-input @input="inputTitle" :name="'标题'" :size="1.1" :value="info.name"/>
      <float-input class="summary" @input="inputSummary" :name="'简介'" :size="0.8" :value="info.summary"/>
    </div>
    <div class="info">
      <div class="cover">
        <img v-if="info.cover" :src="`md/${id}/${info.cover}`"/>
      </div>
      <div class="tags">
        <div v-for="tag in info.tags" :key="tag">
          <span>{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="text">
      <div class="markdown">
        <textarea v-model="mdText"/>
      </div>
      <div class="html">
        <span class="--markdown" v-html="htmlText"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getText, parseMarkdown} from "@/utils";
  import {mapState} from 'vuex'
  import FloatInput from "@/components/FloatInput";

  import '@/assets/style/markdown/default.scss'

  export default {
    name: "MdDetail",
    components: {FloatInput},
    data() {
      return {
        id: 0,
        mdText: ''
      }
    },
    computed: {
      ...mapState(['config']),
      info() {
        for (let i of this.config.md) {
          if (i.file === this.id) {
            return i
          }
        }
        return {}
      },
      htmlText() {
        return parseMarkdown(this.mdText)
      }
    },
    created() {
      this.getMdText()
    },
    watch: {
      $route() {
        if (this.$route.name === 'backend.md.detail') {
          this.getMdText()
        }
      }
    },
    methods: {
      getMdText() {
        this.id = this.$route.params.id;
        getText(`/md/${this.id}/index.md`).then(res => {
          if (res[0]) {
            this.mdText = res[1];
          } else {
            console.log(res[1])
          }
        })
      },
      inputTitle(payload) {
        let info = this.info;
        info.name = payload[1]
      },
      inputSummary(payload) {
        let info = this.info;
        info.summary = payload[1]
      }
    }
}
</script>

<style scoped lang="scss">
.md-detail{
  flex-direction: column;
  background: white;
  width: 95%;
  margin: 1rem auto;
  border-radius: 0.6rem;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.5);
  > .head{
    flex-direction: column;
    margin: 2rem 0;
    width: 100%;
    > .float-input{
      width: 60%;
      &.summary{
        margin-top: 2rem;
        width: 70%;
      }
    }
  }
  > .info{
    width: 100%;
    justify-content: space-around;
    align-items: stretch;
    > .cover{
      margin: 0 2rem;
      > img{
        width: 20rem;
        height: 15rem;
        object-fit: contain;
      }
    }
    > .tags{
      flex-grow: 1;
      align-items: self-start;
      flex-wrap: wrap;
      > div{
        background: #3e41ff;
        margin: 1rem 0.8rem;
        padding: 1rem 0;
        width: 6rem;
        border-radius: 0.2rem;
        justify-content: center;
        > span{
          font-size: 0.9rem;
          color: white;
        }
      }
    }
  }
  > .text{
    margin: 2rem 0;
    width: 99%;
    max-height: 100rem;
    align-items: stretch;
    border: 1px solid #ffc947;
    > .markdown{
      width: 50%;
      > textarea{
        width: 100%;
        height: 100%;
        font-size: 0.95rem;
        line-height: 1.3rem;
        font-family: Consolas;
        border: none;
        border-right: 1px dashed #464646;
      }
    }
    > .html{
      width: 50%;
      overflow-y: auto;
      display: block;
      > span{
        display: block;
        word-break: break-all;
        white-space: pre-line;
      }
    }
  }
}
</style>