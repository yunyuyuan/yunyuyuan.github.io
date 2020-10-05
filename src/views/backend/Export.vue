<template>
  <div class="export" flex>
    <div class="head" flex>
      <div class="select" @click="toggleSelectAll" flex>
        <span :class="{active: allSelected}" class="check-box"></span>
        <a>{{ `全${allSelected ? '不' : ''}选` }}</a>
      </div>
      <span class="state">{{ exporting.state }}</span>
      <loading-button @click.native="doExport" :loading="exporting.b" :text="'导出'" :icon="'save'" :size="1"/>
    </div>
    <div class="body" flex>
      <div v-for="item in md" :key="item.file" flex>
        <span :class="{active: selectList.indexOf(item)!==-1}" class="check-box" @click="toggleSelect(item)"></span>
        <router-link :to="{name: 'article.detail', params: {id: item.file}}" target="_blank">
          <img :src="item.cover"/>
        </router-link>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import jszip from 'jszip';
import fileSaver from 'file-saver';
import Loading from "@/views/block/Loading";
import LoadingButton from "@/components/LoadingButton";
import {originPrefix} from "@/main";
import {parseAjaxError} from "@/utils";
import {mapState} from "vuex";

export default {
  name: "Export",
  components: {LoadingButton, Loading},
  data() {
    return {
      exporting: {
        b: false,
        state: ''
      },
      selectList: []
    }
  },
  computed: {
    ...mapState(['md']),
    allSelected() {
      return this.selectList.length === this.md.length
    }
  },
  methods: {
    toggleSelect(item) {
      let idx = this.selectList.indexOf(item);
      if (idx === -1) {
        this.selectList.push(item)
      } else {
        this.selectList.splice(idx, 1);
      }
    },
    toggleSelectAll() {
      if (!this.allSelected) {
        this.selectList = []
        for (let item of this.md) {
          this.selectList.push(item)
        }
      } else {
        this.selectList = []
      }
    },
    async doExport() {
      if (this.exporting.b) return;
      if (!this.selectList.length) {
        this.$message.warning('请选择需要导出的项目!');
        return
      }
      this.exporting = {
        b: true,
        state: '导出中...'
      }
      let zip = new jszip(),
          ranTime = new Date().getTime();
      try {
        this.exporting.state = '下载:config.json';
        let res = await fetch(`${originPrefix}/config.json?ran=${ranTime}`);
        let txt = await res.text();
        zip.file('config.json', txt);
        for (let item of this.selectList) {
          for (let extend of ['md', 'html']) {
            this.exporting.state = `下载:${item.file}/index.${extend}`;
            let zipFolder = zip.folder(`${item.name}-${item.file}`)
            res = await fetch(`${originPrefix}/md/${item.file}/index.${extend}?ran=${ranTime}`);
            txt = await res.text();
            zipFolder.file(`index.${extend}`, txt);
          }
        }
        this.exporting.state = `正在压缩...`;
        let content = await zip.generateAsync({type: "blob"});
        fileSaver.saveAs(content, "export.zip");
      } catch (err) {
        this.$message.error(parseAjaxError(err));
      }
      this.exporting = {
        b: false,
        state: ''
      }
    }
  }

}
</script>

<style scoped lang="scss">
.export{
  flex-direction: column;
  height: calc(100% - 2rem);
  > .head{
    width: calc(100% - 0.8rem);
    margin-bottom: 1rem;
    padding: 0.4rem;
    justify-content: space-between;
    border-bottom: 1px solid gray;
    > .select{
      cursor: pointer;
      > a{
        font-size: 0.9rem;
        margin-left: 0.4rem;
      }
    }
    > .state{
      color: red;
      height: 1rem;
      font-size: 0.8rem;
    }
  }
  > .body{
    width: 100%;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: auto;
    > div{
      width: 90%;
      padding: 1rem 0;
      border-bottom: 1px solid #a0a0a0;
      > a{
        > img{
          height: 8rem;
          object-fit: contain;
          border: 1px solid #dadada;
          margin: 0 1rem;
        }
      }
      > .name{
        font-size: 1.1rem;
      }
    }
  }
  .check-box{
    display: block;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    border: 1px solid gray;
    border-radius: 50%;
    &.active{
      background: #ff3700;
    }
  }
}
</style>