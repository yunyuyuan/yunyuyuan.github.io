<template>
  <div class="version">
    <span @click="showHelp=true">
      <svg-icon :name="'info'"/>
    </span>
    <div class="new" flex>
      <loading-button :class="{disabled: !inited}" :loading="creating.b" :text="'创建新版本: '+newTag" :icon="'version'" :size="1.6" @click.native="createRelease"/>
      <span v-if="creating.state">{{creating.state}}</span>
    </div>
    <div class="tags">
      <div class="operate" flex>
        <a>{{deletingTag.state}}</a>
        <single-button class="del-btn" :text="'删除'" :deleting="deletingTag.b" @click.native="deleteTag"/>
        <span class="check-box" :class="{active: allSelected}" @click="changeSelectAll"></span>
        <span class="txt">全选</span>
      </div>
      <div class="init-load" v-if="!inited" flex>
        <svg-icon :name="'loading'"/>
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>ref</th>
            <th>sha</th>
            <th>选择</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tags" :key="item.ref" :class="{last: item.last}" :title="item.last?'最新的版本':''">
            <th class="ref">{{item.ref.replace(/^.*?([^\/]*)$/, '$1')}}</th>
            <th class="sha">{{item.object.sha}}</th>
            <th class="select"><label class="check-box" :class="{active: item.selected}" @click="item.selected=!item.selected"></label></th>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="showHelp" class="help" @click.self="showHelp=false" is-dialog>
      <div class="inner">
        <span v-html="help"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {parseAjaxError} from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";
import SingleButton from "@/components/Button";

export default {
  name: "Version",
  components: {SingleButton, LoadingButton},
  data (){
    return {
      showHelp: false,
      help: '<b>在修改代码并push后，需在此提交新版本。</b>\n\nGitHub和jsdelivr有短暂延迟。若长时间后依旧无法访问，请手动pull代码并检查404-temp.html和404.html是否相同。如果不同则需自己复制404-temp.html的内容到404.html并push带github。',
      inited: false,
      creating: {
        b: false,
        state: ''
      },
      deletingTag: {
        b: false,
        state: ''
      },
      tags: [],
    }
  },
  computed: {
    gitUtil (){
      return this._gitUtil()
    },
    allSelected (){
      return this.tags.every(v=>v.selected);
    },
    newTag (){
      let max = 0;
      this.tags.forEach(v=>{
        max = Math.max(max, parseInt(v.ref.replace(/^.*?v([\d.]*)$/, '$1').replace(/\./g, '')));
      })
      max = (max+1).toString();
      return 'v'+(new Array(3-max.length).fill('0').join('')+max).split('').join('.')
    }
  },
  created() {
    this.getTag();
  },
  inject: ['_gitUtil'],
  methods: {
    async getTag (){
      this.tags = [];
      this.inited = false;
      if (this.gitUtil) {
        let res = await this.gitUtil.getTag();
        if (res[0]){
          res[1].map(v=>{
            v.selected = false;
          })
          this.tags = res[1];
        }else{
          this.$message.error(parseAjaxError(res[1]))
        }
        this.inited = true;
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    },
    async createRelease() {
      if (this.creating.b || !this.inited) return
      if (this.gitUtil) {
        this.creating = {
          b: true,
          state: '正在创建release'
        }
        let res = await this.gitUtil.createRelease(this.newTag, this.creating);
        if (res[0]) {
          this.$message.success('创建成功!');
          this.getTag();
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
        this.creating = {
          b: false,
          state: ''
        }
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    },
    changeSelectAll (){
      let b = !this.allSelected;
      this.tags.map(v=>{
        v.selected = b;
      })
    },
    async deleteTag() {
      if (this.deletingTag.b || !this.tags.some(v=>v.selected)) return;
      if (this.allSelected && !confirm('确认删除全部版本?若如此,网站将会无法使用')){
        return
      }
      if (this.gitUtil) {
        this.deletingTag = {
          b: true,
          state: '正在删除...'
        }
        let delList = [];
        this.tags.forEach(v=>{
          if (v.selected){
            delList.push(v.ref)
          }
        })
        let res = await this.gitUtil.deleteTag(delList, this.deletingTag);
        if (res[0]){
          this.$message.success('删除成功');
          this.getTag();
        }else{
          this.$message.error(parseAjaxError(res[1]))
        }
        this.deletingTag = {
          b: false,
          state: ''
        }
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";

.version{
  min-height: calc(100% - 2rem);
  position: relative;
  >span{
    cursor: pointer;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    &:hover{
      >svg{
        fill: red;
      }
    }
    >svg{
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  >.new{
    width: 100%;
    margin: 0.5rem 0 0.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid black;
    justify-content: center;
    flex-direction: column;
    ::v-deep .loading-button{
      width: 15rem;
      padding: 1rem 1.8rem;
      white-space: pre;
      background: linear-gradient(to right, #e02bd2, #4444ff);
    }
    >span{
      color: red;
      margin: 0.5rem 0;
      font-size: 0.85rem;
    }
  }
  >.tags{
    width: 100%;
    >.operate{
      justify-content: flex-end;
      margin: 0.5rem 0;
      >a{
        margin-right: 0.5rem;
        font-size: 0.8rem;
        color: red;
      }
      >.check-box{
        margin: 0 0.5rem 0 1.5rem;
      }
      >.txt{
        margin-right: 0.5rem;
        font-size: 0.9rem;
      }
    }
    >table{
      width: 95%;
      margin: 0 2.5% 1rem 2.5%;
      tbody{
        tr{
          &.last{
            .ref{
              background: #d5e0ff;
            }
          }
        }
        th{
          font-weight: normal;
          padding: 0.8rem 0;
          &:not(:last-of-type){
            border-right: 1px solid rgba(220, 220, 220);
          }
          .check-box{
            margin: 0 auto;
          }
          &.ref{
            width: 15%;
            font-size: 1rem;
          }
          &.sha{
            width: 60%;
            font-size: 0.85rem;
          }
          &.select{
            width: 15%;
          }
        }
      }
    }
  }
  >.help{
    >.inner{
      max-width: 90%;
      >span{
        display: block;
        padding: 2rem 1rem;
        font-size: 1rem;
        white-space: pre-line;
        word-break: break-word;
        line-height: 1.5rem;
      }
    }
  }
  @include media{
    width: 99% !important;
    margin-left: 0.5% !important;
  }
}
</style>