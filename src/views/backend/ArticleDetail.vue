<template>
  <div class="md-detail" flex>
    <div class="operate" flex>
      <div class="back" @click="$router.push('/article')" flex="">
        <svg-icon :name="'back'"/>
        <span>返回</span>
      </div>
      <a @click="showGuide = true" flex>
        <svg-icon :name="'info'"/>
        markdown语法指南
      </a>
      <loading-button :loading="saving.b" :text="'上传'" :icon="'save'" @click.native="save"/>
      <span class="state">{{ saving.state }}</span>
    </div>
    <div class="head" flex>
      <float-input @input="inputTitle" :name="'标题'" :size="1.3" :value="info.name"/>
      <float-input class="summary" @input="inputSummary" :name="'简介'" :size="1"
                   :value="info.summary"/>
    </div>
    <div class="info" flex>
      <div class="cover">
        <loading-img :src="info.cover" :size="[20, 15]" :data-viewer="true" v-viewer/>
        <label flex>
          <span>封面链接:</span>
          <input :value="info.cover" @focusout="changeCover"/>
        </label>
      </div>
      <div class="tags-time" flex>
        <div class="tags" flex>
          <span class="tag-icon" flex>
            <svg-icon :name="'tag'"/>
          </span>
          <div v-for="(tag, idx) in info.tags" :class="{editing: tagEditIndex===idx}" :key="tag">
            <input :disabled="tagEditIndex!==idx" @focusout="editTag" :data-old="tag" :data-idx="idx" :value="tag"/>
            <div flex="">
              <span @click="clickTrash(idx)" title="删除">
                <svg-icon :name="'trash'"/>
              </span>
              <span @click="clickEdit" :data-idx="idx" title="编辑">
                <svg-icon :name="'edit'"/>
              </span>
            </div>
          </div>
          <span class="add" @click="addTag" title="添加标签" flex>
            <svg-icon :name="'add'"/>
          </span>
        </div>
        <div class="time" flex>
          <span><span>创建:</span>{{ (info ? info.time : 0) | time(false) }}</span>
          <span><span>修改:</span>{{ (info ? info.modifyTime : 0) | time(false) }}</span>
        </div>
      </div>
    </div>
    <div class="text" flex ref="text">
      <div class="head" flex>
        <span @click="enableSticker" title="表情" :class="{active: showSticker}" flex>
          <svg-icon :name="'cmt-sticker'"/>
        </span>
        <div class="sticker" ref="sticker" :class="{active: showSticker}" flex v-if="config.sticker">
          <div class="content">
            <div class="inner" :style="{width: `${config.sticker.length}00%`, left: `${stickerSlideNow*-100}%`}" flex>
              <div v-for="item in config.sticker" :style="{width: `${100/config.sticker.length}%`}" flex>
                <span v-for="idx in item.count" @click="addSticker(item.folder, idx)" flex>
                  <img :src="`${baseUrl}/sticker/${item.folder}/${idx}.png?ran=${stamp}`"/>
                </span>
              </div>
            </div>
          </div>
          <div class="switch" flex>
            <span v-for="(item, idx) in config.sticker" @click="stickerSlideNow = idx"
                  :class="{active: stickerSlideNow===idx}" flex>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="body" flex>
        <div class="markdown" :style="{width: mdWidth}" flex>
          <div ref="textarea" class="textarea"></div>
        </div>
        <resizer :orient="'h'" @start="startResize" @resize="doResize"/>
        <div class="html" flex>
          <span ref="html" class="--markdown" v-html="htmlText" v-viewer></span>
        </div>
      </div>
    </div>
    <markdown-help v-show="showGuide" @click.native.self="showGuide=false"/>
  </div>
</template>

<script>
import {cdnDynamicUrl, originPrefix} from "@/need";
import {getText, parseAjaxError, sortByTime} from "@/utils/utils";

import FloatInput from "@/components/FloatInput";
import LoadingButton from "@/components/LoadingButton";

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/mode/markdown/markdown';

import 'codemirror/lib/codemirror.css';
import '@/assets/style/code-mirror/codeMirror.scss';

import '@/assets/style/code-mirror/light-markdown.scss';
import '@/assets/style/code-mirror/dracula-markdown.scss';
import Resizer from "@/components/Resizer";
import MarkdownHelp from "@/views/block/MarkdownHelp";
import LoadingImg from "@/components/LoadingImg";
import {parseMarkdown, processMdHtml} from "@/utils/parseMd";
import {hljsAndInsertCopyBtn} from "@/utils/highlight";
import siteConfig from "@/site-config";
import {getCache, setCache} from "@/views/backend/storage";


export default {
  name: "ArticleDetail",
  components: {LoadingImg, MarkdownHelp, Resizer, LoadingButton, FloatInput},
  props: {
    md: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      stamp: siteConfig.timeStamp,
      baseUrl: cdnDynamicUrl,
      showGuide: false,
      showSticker: false,
      stickerSlideNow: 0,
      focusAt: 0,
      tagEditIndex: -1,
      mdText: '',
      codeMirror: null,
      mdWidth: '40%',
      resizeStart: {
        pos: false,
        size: false
      },
      saving: {
        b: false,
        state: ''
      },
      cacheTimeout: null,
      cacheInit: false,
      info: {},
      newInfo: {
        name: "编辑标题",
        file: "",
        cover: "",
        time: "",
        modifyTime: "",
        summary: "编辑简介",
        tags: []
      },
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    htmlText() {
      return parseMarkdown(this.mdText)
    },
    gitUtil (){
      return this._gitUtil()
    },
    config (){
      return this._config()
    }
  },
  inject: ['_config', '_gitUtil', 'showCacheFinish'],
  async mounted() {
    await this.init()
  },
  watch: {
    async '$props.md'() {
      await this.init()
    },
    info: {
      deep: true,
      handler (){
        this.saveCache()
      }
    },
    mdText: {
      deep: true,
      handler (){
        this.saveCache()
      }
    },
    htmlText (){
      this.$nextTick(()=>{
        processMdHtml(this.$refs.html)
      })
    }
  },
  beforeRouteLeave (to, from, next){
    if (this.id !== 'new'){
      if (confirm('确定离开?将会丢失修改')){
        next()
      }
    }else{
      next()
    }
  },
  methods: {
    async init() {
      this.cacheInit = false;
      const cache = getCache('new-article');
      if (this.id === 'new' && cache){
        this.info = JSON.parse(cache);
      }else{
        this.info = JSON.parse(JSON.stringify(this.id === 'new' ? this.newInfo : this.md.find(v => v.file === this.id)||this.newInfo));
      }
      // 初始化信息
      this.$nextTick(()=>{
        this.cacheInit = true;
      })
      let mdText = '';
      // 标题
      document.title = '后台-文章-' + this.id;
      if (this.$route.params.id !== 'new') {
        let res = await getText(`${originPrefix}/md/${this.id}/index.md`);
        if (res[0]) {
          mdText = res[1];
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
      }else{
        mdText = getCache('new-article-md')||'';
      }
      if (!this.codeMirror) {
        this.codeMirror = new CodeMirror(this.$refs.textarea, {
          indentUnit: 2,
          tabSize: 2,
          theme: 'light',
          lineNumbers: true,
          line: true,
          mode: 'markdown',
          matchTags: {bothTags: true},
          matchBrackets: true
        });
        this.codeMirror.on('change', () => {
          this.mdText = this.codeMirror.getValue()
        });
        this.codeMirror.on('blur', () => {
          this.focusAt = this.codeMirror.getCursor();
        })
      }
      this.codeMirror.setValue(mdText);
    },
    enableSticker(e) {
      if (this.showSticker) {
        document.removeEventListener('click', this.handleStickerDiv)
        this.showSticker = false;
        return
      }
      this.showSticker = true;
      e.stopPropagation();
      document.addEventListener('click', this.handleStickerDiv)
    },
    handleStickerDiv(e) {
      let vue_ = this,
          stickerDiv = this.$refs.sticker;
      let target = e.target;
      while (true) {
        if (target !== stickerDiv) {
          target = target.parentElement;
          if (!target) {
            document.removeEventListener('click', this.handleStickerDiv);
            vue_.showSticker = false;
            break;
          }
        } else {
          break
        }
      }
    },
    addSticker (folder, idx){
      if (!this.focusAt) {
        this.$message.warning('请先点选择输入框!');
        return
      }
      this.codeMirror.replaceRange(`![sticker](${cdnDynamicUrl}/sticker/${folder}/${idx}.png?ran=${siteConfig.timeStamp})`, this.focusAt);
      document.removeEventListener('click', this.handleStickerDiv);
      this.showSticker = false;
    },
    saveCache (){
      if (!this.cacheInit) return ;
      if (this.id !== 'new') return;
      if (this.cacheTimeout) clearTimeout(this.cacheTimeout);
      this.cacheTimeout = setTimeout(()=>{
        setCache('new-article', JSON.stringify(this.info));
        setCache('new-article-md', this.mdText);
        this.showCacheFinish()
      }, 2000)
    },
    // ----- change -------
    inputTitle(payload) {
      this.info.name = payload[1]
    },
    inputSummary(payload) {
      this.info.summary = payload[1]
    },
    changeCover(e) {
      this.info.cover = e.target.value;
    },
    clickTrash(idx) {
      this.info.tags.splice(idx, 1)
    },
    clickEdit(e) {
      let span = e.currentTarget;
      this.tagEditIndex = parseInt(span.getAttribute('data-idx'));
      this.$nextTick(() => {
        span.parentElement.previousElementSibling.focus()
      })
    },
    editTag(e) {
      let info = this.info,
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
      this.info.tags.push('输入标签' + this.info.tags.length)
    },
    startResize (startPos){
      this.resizeStart = {
        pos: startPos,
        size: this.$refs.text.querySelector('.markdown').scrollWidth
      };
    },
    doResize (delta){
      let parentWidth = this.$refs.text.scrollWidth;
      let newSize = this.resizeStart.size + (delta-this.resizeStart.pos);
      if (newSize > parentWidth/5 && newSize < parentWidth*4/5){
        this.mdWidth = `${newSize}px`;
      }
    },
    async save() {
      if (this.saving.b) return;
      if (this.gitUtil) {
        const md = this.mdText,
            html = this.htmlText;
        let info = this.info;
        if (!info.name || !info.summary || !info.tags.length || !info.cover) {
          return this.$message.warning('标题,简介,标签和封面均不能为空!')
        }
        this.saving = {
          b: true,
          state: '保存中...'
        };
        let folderId = new Date().getTime();
        info.modifyTime = folderId;
        if (this.id !== 'new') {
          // 不改folder
          folderId = this.id;
        } else {
          // 添加
          // md +1
          info.file = folderId.toString();
          info.time = folderId;
          this.md.push(JSON.parse(JSON.stringify(info)));
        }
        // 执行更新
        // 更新本地md
        for (let i in this.md) {
          if (this.md[i].file === this.id) {
            this.md[i] = info;
            break
          }
        }
        this.saving.state = '更新:md.json';
        sortByTime(this.md);
        let res = await this.gitUtil.updateJsonFile('md.json', this.md);
        if (res[0]) {
          // 更新 md 和 html文件
          let res = await this.gitUtil.updateMd({
            folder: folderId,
            md: md,
            html: html
          }, this.saving);
          if (res[0]) {
            this.$message.success('上传成功!');
            window.location.reload()
          } else {
            this.$message.error(parseAjaxError(res[1]))
          }
        } else {
          this.$message.error(parseAjaxError(res[1]))
        }
        this.saving = {
          b: false,
          state: ''
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

.md-detail {
  flex-direction: column;
  position: relative;

  > .operate{
    margin-bottom: 0.5rem;
    justify-content: space-between;
    width: calc(100% - 0.5rem);
    padding: 0.2rem 0.2rem 0 0.2rem;
    flex-wrap: wrap;
    > .back{
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

    > a {
      font-size: 0.9rem;
      cursor: pointer;

      &:hover {
        color: #ff3c00;
        text-decoration: underline;

        > svg {
          fill: #ff3c00;
        }
      }

      > svg {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.8rem;
      }
    }

    > ::v-deep .loading-button {
      padding: 0.4rem 0.8rem;
      background: #66dded;
      box-shadow: 0 0 0.3rem #00000078;
      color: black;
      &:not(.loading):hover{
        background: #62c7db;
      }
      &.loading{
        background: gray;
        color: white;
      }
    }
    > .state{
      width: 100%;
      text-align: right;
      color: red;
      height: 1rem;
      font-size: 0.8rem;
      padding: 0.2rem 0;
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
      justify-content: space-around;
      flex-direction: column;
      border: 1px solid gray;
      box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.15);
      ::v-deep .loading-img{
        img{
          object-fit: contain;
        }
      }
      > label {
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

    > .tags-time {
      flex-direction: column;
      flex-grow: 1;

      > .tags {
        align-content: start;
        flex-wrap: wrap;

        > .tag-icon {
          margin-right: 2rem;

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

      > .time {
        width: 100%;
        height: 3rem;
        justify-content: space-around;
        margin-top: auto;

        > span {
          color: #0003ff;
          font-size: 0.9rem;

          > span {
            font-size: 0.9em;
            color: black;
            margin-right: 0.5rem;
          }
        }
      }
    }
  }

  > .text{
    width: 100%;
    flex-direction: column;
    margin: 0.5rem 0 0.4rem 0;
    border-top: 1px dashed gray;
    > .head{
      width: 95%;
      padding: 0.5rem 2.5%;
      position: relative;
      margin: 0.5rem 0;
      >span{
        cursor: pointer;
        >svg{
          width: 2rem;
          height: 2rem;
        }
      }
      > .sticker {
        width: 90%;
        position: absolute;
        left: 5%;
        top: 105%;
        border-radius: 0.2rem;
        height: 0;
        background: white;
        flex-direction: column;
        z-index: 10;
        overflow: hidden;
        transition: height .1s linear;
        &.active{
          height: 50vh;
          border: 1px solid #ababab;
          box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.4);
        }
        >.content{
          width: 100%;
          overflow: hidden;
          flex-grow: 1;
          >.inner{
            border-radius: inherit;
            height: 100%;
            transition: all .1s linear;
            position: relative;
            >div {
              height: 100%;
              overflow-y: auto;
              flex-wrap: wrap;
              align-items: flex-start;

              > span {
                width: 3.6rem;
                height: 3.6rem;
                border: 1px solid #d8d8d8;
                cursor: pointer;
                background: white;
                justify-content: center;

                &:hover {
                  background: #e6e6e6;

                  > img {
                    transform: scale(1.1);
                  }
                }

                > img {
                  transition: transform .1s ease-out;
                  width: 70%;
                  height: 70%;
                  object-fit: contain;
                }
              }
            }
          }
        }

        > .switch {
          width: 100%;
          height: 1.5rem;
          flex-shrink: 0;
          border-top: 1px solid #676767;
          background: #ececec;

          > span {
            height: 100%;
            font-size: 0.8rem;
            justify-content: center;
            width: 4rem;
            border-right: 1px solid #b5b5b5;
            cursor: pointer;

            &:not(.active):hover {
              background: #bababa;
            }

            &.active {
              background: #333333;
              color: white;
            }
          }
        }
      }
    }
    > .body{
      width: calc(100% - 2px);
      max-height: 100vh;
      min-height: 30rem;
      align-items: stretch;
      border: 1px solid #656565;
      > .markdown{
        align-items: stretch;
        flex-shrink: 0;

        > .textarea{
          width: 100%;

          > ::v-deep .CodeMirror{
            height: 100%;
            font-size: 0.85rem;
          }
        }
      }
      > ::v-deep .resizer{
        background: #828282;
        width: 0.3rem;
        flex-shrink: 0;
        &[resizing]{
          background: #505050;
        }
      }
      > .html{
        overflow-y: auto;
        display: block;
        flex-grow: 1;

        > span{
          display: block;
          padding: 0.5rem 0.5rem 0.5rem 2.7rem;
          width: calc(100% - 3.2rem);
        }
      }
    }
  }
  @include media{
    width: 99% !important;
    margin-left: 0.5% !important;
    > .info {
      flex-direction: column;
      >.cover{
        ::v-deep .loading-img{
          width: 100% !important;
        }
      }
    }
    >.text{
      >.body{
        >.html{
          >span{
            padding: 0.5rem;
            width: calc(100% - 1rem);
          }
        }
      }
    }
  }
}
</style>