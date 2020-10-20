<template>
  <div class="version">
    <div class="new" flex>
      <loading-button :class="{disabled: !inited}" :loading="creating" :text="'创建新版本: '+newTag" :icon="'version'" :size="1.6" @click.native="createRelease"/>
    </div>
    <div class="tags">
      <div class="operate" flex>
        <a>{{deletingTag.state}}</a>
        <single-button class="del-btn" :text="'删除'" :deleting="deletingTag.b" @click.native="deleteTag"/>
        <label class="checkbox" :class="{active: allSelected}" @click="changeSelectAll"></label>
        <span>全选</span>
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
            <th class="select"><label class="checkbox" :class="{active: item.selected}" @click="item.selected=!item.selected"></label></th>
          </tr>
        </tbody>
      </table>
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
      inited: false,
      creating: false,
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
        max = Math.max(max, parseInt(v.ref.replace(/^.*?v([\d.]*)$/, '$1').replaceAll('.', '')));
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
      if (this.creating || !this.inited) return
      if (this.gitUtil) {
        this.creating = true
        let res = await this.gitUtil.createRelease(this.newTag);
        if (res[0]) {
          this.$message.success('创建成功!');
          await this.getTag();
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
        this.creating = false;
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
          await this.getTag();
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
  label.checkbox{
    display: block;
    cursor: pointer;
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid #a8a8a8;
    border-radius: 0.2rem;
    &.active{
      background: #ff996a;
    }
  }
  >.new{
    width: 100%;
    margin: 0.5rem 0 0.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid black;
    justify-content: center;
    ::v-deep .loading-button{
      width: 15rem;
      background: linear-gradient(to right, red, blue);
      padding: 1rem 1.8rem;
      &:hover{
        background: linear-gradient(to right, blue, red);
      }
      &.loading, &.disabled{
        cursor: not-allowed;
        background: gray;
      }
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
      >label{
        margin: 0 0.5rem 0 1.5rem;
      }
      >span{
        margin-right: 0.5rem;
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
          .checkbox{
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
  @include media{
    width: 99% !important;
    margin-left: 0.5% !important;
  }
}
</style>