<template>
  <div class="md-detail" flex>
    <div class="operate" flex>
      <div class="back" @click="$router.push({name: 'backend.md'})">
        <svg-icon :name="'back'"/>
        <span>返回</span>
      </div>
      <loading-button :loading="saving" :text="'上传'" :icon="'save'" @click.native="save"/>
    </div>
    <div class="head" flex>
      <float-input @input="inputTitle" :name="'标题'" :size="1.3" :value="getInfo()?getInfo().name:''"/>
      <float-input class="summary" @input="inputSummary" :name="'简介'" :size="1"
                   :value="getInfo()?getInfo().summary:''"/>
    </div>
    <div class="info" flex>
      <div class="cover">
        <img :src="getInfo()?getInfo().cover: defaultCover"/>
        <label>
          <span>封面链接:</span>
          <input @focusout="changeCover"/>
        </label>
      </div>
      <div class="tags" flex>
        <span class="tag-icon">
          <svg-icon :name="'tag'"/>
        </span>
        <div v-for="(tag, idx) in getInfo()?getInfo().tags:[]" :class="{editing: tagEditIndex===idx}" :key="tag">
          <input :disabled="tagEditIndex!==idx" @focusout="editTag" :data-old="tag" :data-idx="idx" :value="tag"/>
          <div>
            <span @click="clickTrash(idx)">
              <svg-icon :name="'trash'"/>
            </span>
            <span @click="clickEdit" :data-idx="idx">
              <svg-icon :name="'edit'"/>
            </span>
          </div>
        </div>
        <span class="add" @click="addTag">
          <svg-icon :name="'add'"/>
        </span>
      </div>
    </div>
    <div class="text" flex ref="text">
      <div class="markdown" :style="{width: mdWidth}" flex>
        <div ref="textarea" class="textarea"></div>
      </div>
      <span class="resize" :resizing="resizing" @mousedown="startResize"></span>
      <div class="html" flex>
        <span class="--markdown" v-html="htmlText"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {staticFolder} from "@/main";
import {getText, parseAjaxError, parseMarkdown} from "@/utils";
import {mapState} from 'vuex'
import FloatInput from "@/components/FloatInput";

import LoadingButton from "@/components/LoadingButton";

import defaultCover from '@/image/default-cover.png';

import "@/assets/style/hljs.css";


import CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/darcula.css';


export default {
  name: "MdDetail",
  components: {LoadingButton, FloatInput},
  data() {
    return {
      defaultCover,
      tagEditIndex: -1,
      mdText: '',
      codeMirror: null,
      mdWidth: '40%',
      resizing: false,
      saving: false,
      newInfo: {
        name: "编辑标题",
        file: "",
        cover: "",
        time: "",
        summary: "编辑简介",
        tags: []
      }
    }
  },
  computed: {
    ...mapState(['gitUtil', 'config']),
    id() {
      return this.$route.params.id
    },
    info() {
      for (let i of this.config.md) {
        if (i.file === this.id) {
          return i
        }
      }
    },
    htmlText() {
      return parseMarkdown(this.mdText)
    }
  },
  async created() {
    await this.init()
  },
  mounted() {
    this.codeMirror = new CodeMirror(this.$refs.textarea, {
      indentUnit: 2,
      tabSize: 2,
      theme: 'idea',
      lineNumbers: true,
      line: true,
      mode: 'markdown',
    });
    this.codeMirror.on('change', () => {
      this.mdText = this.codeMirror.getValue()
    });
    this.codeMirror.setValue(this.mdText)
  },
  watch: {
    async $route() {
      await this.init()
    }
  },
  methods: {
    async init() {
      this.mdText = '';
      if (this.$route.name === 'backend.md.detail') {
        // 标题增加详情
        document.title += this.id;
        if (this.$route.params.id !== 'new') {
          await this.getMdText()
        }
      }
    },
    async getMdText() {
      let res = await getText(`${staticFolder}/md/${this.id}/index.md`);
      if (res[0]) {
        this.mdText = res[1];
      } else {
        this.$message.error(parseAjaxError(res[1]))
      }
    },
    getInfo() {
      return this.id === 'new' ? this.newInfo : this.info;
    },

    inputTitle(payload) {
      let info = this.getInfo();
      info.name = payload[1]
    },
    inputSummary(payload) {
      let info = this.getInfo();
      info.summary = payload[1]
    },
    changeCover(e) {
      let info = this.getInfo();
      info.cover = e.target.value;
    },
    clickTrash(idx) {
      let info = this.getInfo();
      info.tags.splice(idx, 1)
    },
    clickEdit(e) {
      let span = e.currentTarget;
      this.tagEditIndex = parseInt(span.getAttribute('data-idx'));
      this.$nextTick(() => {
        span.parentElement.previousElementSibling.focus()
      })
    },
    editTag(e) {
      let info = this.getInfo(),
          input = e.target;
      this.tagEditIndex = -1;
      for (let i of info.tags) {
        if (i !== input.getAttribute('data-old') && i === input.value) {
          return this.$message.warning('标签不能重复!');
        }
      }
      info.tags.splice(parseInt(input.getAttribute('data-idx')), 1, input.value);
    },
    addTag() {
      let info = this.getInfo();
      info.tags.push('输入标签' + info.tags.length)
    },
    startResize (){
      let vue_ = this;
      let parentLeft = this.$refs.text.getBoundingClientRect().x,
          parentWidth = this.$refs.text.scrollWidth;
      document.body.setAttribute('unselectable', '');
      function resize(e) {
        if (e.clientX >= document.body.clientWidth || e.clientY >= document.body.clientHeight ){
          return release()
        }
        let w = e.clientX - parentLeft;
        if (w >= parentWidth/5 && w <= parentWidth*4/5){
          vue_.mdWidth = w+'px';
          window.dispatchEvent(new Event('resize'))
        }
      }
      function release() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', release);
        document.body.removeAttribute('unselectable');
        vue_.resizing = false;
      }
      this.resizing = true;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', release)
    },
    async save() {
      if (this.saving) return;
      if (this.gitUtil) {
        let info = this.getInfo();
        if (!info.name || !info.summary || !info.tags.length || !info.cover) {
          return this.$message.warning('标题,简介,标签和封面均不能为空!')
        }
        this.saving = true;
        let folderId = new Date().getTime();
        info.time = folderId;
        if (this.id !== 'new') {
          // 更新
          folderId = this.id;
        } else {
          // 添加
          // config md +1
          info.file = folderId.toString();
          let mdList = this.config.md;
          mdList.push(JSON.parse(JSON.stringify(info)));
        }
        // 执行更新
        // 更新config.json
        let res = await this.gitUtil.updateConfig(this.config);
        if (res[0]) {
          // 更新 md 和 html文件
          let res = await this.gitUtil.updateMd({
            folder: folderId,
            md: this.mdText,
            html: this.htmlText
          });
          if (res[0]) {
            this.$message.success('上传成功!');
            this.$router.push({name: 'backend.md'})
          } else {
            this.$message.error(parseAjaxError(res[1]))
          }
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
        this.saving = false
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.md-detail {
  flex-direction: column;
  background: white;
  width: 95%;
  margin: auto;
  border-radius: 0.6rem;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.5);
  position: relative;

  > .operate {
    margin-bottom: 1rem;
    justify-content: space-between;
    width: calc(100% - 0.5rem);
    padding: 0.2rem;

    > .back {
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
      justify-content: center;
      background: #ff8595;
      transition: all .15s linear;

      &:hover {
        background: #ee647e;
      }

      > svg {
        width: 1.4rem;
        height: 1.4rem;
      }

      > span {
        font-size: 0.9rem;
        margin-left: 0.5rem;
      }
    }

    > ::v-deep .loading-button {
      padding: 0.4rem 0.8rem;
      background: #66dded;
      box-shadow: 0 0 0.3rem #00000078;
      color: black;

      &:not(.loading):hover {
        background: #62c7db;
      }

      &.loading {
        background: gray;
        color: white;
      }
    }
  }

  > .head {
    flex-direction: column;
    margin: 3rem 0;
    width: 100%;

    > .float-input {
      width: 60%;

      ::v-deep input {
        text-align: center !important;
      }

      &.summary {
        margin-top: 3rem;
        width: 70%;
      }
    }
  }

  > .info {
    width: 100%;
    justify-content: space-around;
    align-items: stretch;

    > .cover {
      margin: 0 2rem;
      border-radius: 0.8rem;
      padding: 0.5rem;
      border: 1px dotted black;
      justify-content: space-around;
      flex-direction: column;
      box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.3);

      > img {
        width: 20rem;
        height: 15rem;
        object-fit: contain;
        border-radius: inherit;
      }

      > label {
        display: flex;
        align-items: center;
        margin: 1rem 0 0.5rem 0;

        > span {
          font-size: 0.88rem;
          margin-right: 0.5rem;
        }

        > input {
          border: 1px solid gray;
          padding: 0.15rem;
          font-size: 0.95rem;
        }
      }
    }

    > .tags {
      flex-grow: 1;
      align-content: start;
      flex-wrap: wrap;

      > .tag-icon {
        margin-right: 2rem;
        display: flex;
        align-items: center;

        > svg {
          width: 2.6rem;
          height: 2.6rem;
        }
      }

      > div {
        margin: 1rem 0.8rem;
        border-radius: 0.2rem;
        justify-content: center;
        position: relative;
        height: 2.5rem;
        box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.26);

        > input {
          font-size: 0.96rem;
          width: 12rem;
          height: 100%;
          border-radius: inherit;
          text-align: center;
          background: white;
          color: black;
          border: 1px solid gray;
          transition: all .2s linear;

          &:disabled {
            color: white;
            width: 6rem;
            background: #3e41ff;
            border-color: transparent;
          }
        }

        > div {
          display: none;
          position: absolute;
          border-radius: inherit;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          justify-content: space-around;
          background: rgba(0, 0, 0, 0.4);

          > span {
            cursor: pointer;
            padding: 0.15rem 0.4rem;
            border-radius: 0.2rem;

            &:hover {
              background: rgba(255, 255, 255, 0.31);
            }

            > svg {
              width: 1.4rem;
              height: 1.4rem;
            }
          }
        }

        &:not(.editing):hover {
          > div {
            display: flex;
          }
        }
      }

      > .add {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        background: #ffc722;
        justify-content: center;
        display: flex;
        align-items: center;
        margin-left: 1rem;
        box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);

        &:hover {
          background: #eab61f;
        }

        > svg {
          width: 1.2rem;
          height: 1.2rem;
          fill: white;
        }
      }
    }
  }

  > .text {
    margin: 1rem 0 0.4rem 0;
    width: 99%;
    max-height: 50rem;
    min-height: 10rem;
    align-items: stretch;
    border: 1px solid #656565;

    > .markdown {
      align-items: stretch;
      flex-shrink: 0;

      > .textarea {
        width: 100%;
        > ::v-deep .CodeMirror{
          height: 100%;
          font-size: 0.9rem;
        }
      }
    }
    >.resize{
      background: #828282;
      width: 0.3rem;
      cursor: e-resize;
      flex-shrink: 0;
      &[resizing]{
        background: #505050;
      }
    }

    > .html {
      overflow-y: auto;
      display: block;
      flex-grow: 1;

      > span {
        display: block;
        word-break: break-all;
        white-space: pre-line;
        width: 100%;
      }
    }
  }
}
</style>