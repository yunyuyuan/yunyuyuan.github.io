<template>
  <div class="md" flex>
    <div class="head" flex>
      <div class="delete-state" v-if="deleting.bool">
        <svg-icon :name="'loading'"/>
        <span>{{ deleting.state }}</span>
      </div>
      <loading-button :text="'新建'" :icon="'add'" class="new" @click.native="newArticle"/>
    </div>
    <div class="list" flex>
      <table>
        <thead>
        <tr>
          <td class="cover">封面</td>
          <td class="title">标题</td>
          <td class="summary">简介</td>
          <td class="time">时间</td>
          <td class="tags">标签</td>
          <td class="operate">操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in reverseList" :key="item.file">
          <router-link tag="td" class="cover" :to="{name: 'backend.md.detail', params: {id: item.file}}">
            <img :src="item.cover || selfImage"/>
          </router-link>
          <td class="title"><span>{{ item.name }}</span></td>
          <td class="summary"><span>{{ item.summary }}</span></td>
          <td class="time">
            <div flex>
              <span>创建:</span>
              <a>{{ parseTime(item.createTime) }}</a>
            </div>
            <div flex>
              <span>修改:</span>
              <a>{{ parseTime(item.modifyTime) }}</a>
            </div>
          </td>
          <td class="tags">
            <div flex="">
              <span :style="{background: colorList[tag]}" v-for="tag in item.tags">{{ tag }}</span>
            </div>
          </td>
          <td class="operate">
            <single-button :text="'删除'" @click.native="removeMd(item.file)" :deleting="deleting.bool"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SingleButton from "@/components/Button";
import {mapState} from "vuex";
import selfImage from '@/image/i.png'
import LoadingButton from "@/components/LoadingButton";
import {parseAjaxError, parseTime, randomTagColor, randomTagColorList} from "@/utils";

export default {
  name: "Md",
  components: {LoadingButton, SingleButton},
  data() {
    return {
      selfImage,
      deleting: {
        bool: false,
        state: ''
      }
    }
  },
  computed: {
    ...mapState(['config', 'gitUtil']),
    mdList() {
      //     "name": "测试",
      //     "file": "1",
      //     "cover": "cover.jpg",
      //     "time": "2020.9.13",
      //     "summary": "测试这个博客的md",
      //     "tags": ["文章","js"]
      return this.config.md
    },
    colorList() {
      return randomTagColorList(this.mdList)
    },
    reverseList() {
      return this.mdList.reverse()
    }
  },
  methods: {
    newArticle() {
      this.$router.push({name: 'backend.md.detail', params: {id: 'new'}})
    },
    parseTime(time) {
      return parseTime(time, true)
    },
    ranColor() {
      return randomTagColor();
    },
    async removeMd(file) {
      if (this.deleting.bool) return;
      if (this.gitUtil) {
        if (confirm('确认删除?')) {
          let err = null;
          this.deleting = {
            bool: true,
            state: '更新配置'
          };
          // 更新config
          let fakeMdList = this.mdList.slice();
          for (let i=0;i<fakeMdList.length;i++){
            if (fakeMdList[i].file === file){
              fakeMdList.splice(i, 1);
              break
            }
          }
          let fakeConfig = JSON.parse(JSON.stringify(this.config));
          fakeConfig.md = fakeMdList;
          let res = await this.gitUtil.updateConfig(fakeConfig);
          this.deleting.state = '准备删除';
          if (res[0]) {
            // 删除文件夹
            res = await this.gitUtil.removeMd(file, this.deleting);
            if (res[0]) {
              this.$message.success('删除成功!');
              this.$store.commit('updateConfig', fakeConfig);
            } else {
              err = res[1];
            }
          }else{
              err = res[1];
          }
          if (err) {
            this.$message.error(parseAjaxError(err));
          }
          this.deleting = {
            bool: false,
            state: ''
          };
        }
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "src/assets/style/public";
  .md{
    min-height: 90%;
    flex-direction: column;

  >.head{
    width: 100%;
    margin: 1rem 0;
    justify-content: space-between;
    >.delete-state{
      margin-left: 1rem;
      >svg{
        width: 1.5rem;
        height: 1.5rem;
      }
      >span{
        color: red;
        font-size: 0.8rem;
        margin-left: 0.6rem;
      }
    }
    > ::v-deep .new{
      margin: 0 1rem 0 auto;
      background: #ffd784;
      padding: 0.6rem 1.2rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
      &:hover{
        background: #efca7c;
      }
      >svg{
        width: 1.2rem;
        height: 1.2rem;
        fill: #000000;
      }
      >span{
        margin-left: 0.5rem;
        font-size: 0.95rem;
        color: black;
      }
    }
  }
  >.list{
    width: 95%;
    margin: 1rem 0;
    >table{
      width: 100%;
      tbody{
        tr{
          height: 8rem;
          td{
            text-align: center;
            &.title, &.summary{
              > span{
                @include text-overflow(4);
              }
            }
            &.cover{
              cursor: pointer;
              width: 15%;
              img{
                height: 8rem;
                object-fit: contain;
              }
            }
            &.title{
              width: 25%;
              font-size: 1.04rem;
              word-break: break-all;
              white-space: pre-line;
            }
            &.summary{
              width: 26%;
              font-size: 0.85rem;
              color: #545454;
            }
            &.time {
              width: 12%;
              font-weight: 500;
              max-width: 10rem;

              > div {
                flex-direction: column;

                span, a {
                  word-break: keep-all;
                  white-space: nowrap;
                }

                > span {
                  font-size: 0.8rem;
                  margin-right: 0.4rem;
                }

                > a {
                  font-size: 0.88rem;
                  color: #0003ff;
                }
              }
            }
            &.tags {
              width: 15%;

              > div {
                flex-wrap: wrap;

                > span {
                  margin: 0.4rem 0.2rem;
                  padding: 0.3rem 0.8rem;
                  font-size: 0.8rem;
                  border-radius: 0.2rem;
                  color: white;
                }
              }
            }
            &.operate{
              width: 8%;
              ::v-deep .single-button {
                border-radius: 0.2rem;
                background: #ff344f;
                width: 2.4rem;
                margin: 0 0.5rem;

                &[deleting] {
                  background: #727272;
                  cursor: not-allowed;
                }

                &:not([deleting]):hover {
                  background: #f1314a;
                }
              }
            }
          }
        }
      }
    }
  }

}
</style>