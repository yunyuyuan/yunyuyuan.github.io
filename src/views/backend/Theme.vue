<template>
  <div class="theme" flex>
    <div class="head" flex>
      <loading-button :loading="false" :icon="'reset'" :text="'重置为默认'" @click.native="reset"/>
      <loading-button :loading="saving" :icon="'save'" :text="'保存'" @click.native="save"/>
    </div>
    <div class="body" flex>
      <div class="edit" flex ref="text">
        <div class="left" :style="{width: mdWidth}" flex>
          <span class="icon" flex>
            <svg-icon :name="'edit'"/>
            <span>编辑sass</span>
            <a target="_blank" href="https://sass-lang.com/" title="sass是什么?" flex>
              <svg-icon :name="'info'"/>
            </a>
          </span>
          <div class="textarea" ref="textarea"></div>
        </div>
        <span class="resize" :resizing="resizing" @mousedown="startResize"></span>
        <div class="right" flex>
          <span class="icon" flex>
            <svg-icon :name="'brash'"/>
            <span>效果</span>
          </span>
          <div ref="markdown">
            <span class="--markdown" v-html="html"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingButton from "@/components/LoadingButton";
import {mapState} from "vuex";
import {getText, parseAjaxError, parseMarkdown} from "@/utils";
import {staticFolder} from "@/main";
import testText from 'text-loader!@/assets/test.md';

import Sass from 'sass.js';

import CodeMirror from 'codemirror';
import 'codemirror/mode/sass/sass.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/darcula.css';

import defaultMarkdownStyle from '!!text-loader!@/assets/style/markdown-default.scss'


export default {
  name: "Theme",
  components: {LoadingButton},
  data() {
    return {
      saving: false,
      scss: '',
      html: parseMarkdown(testText),
      codeMirror: null,
      mdWidth: '40%',
      resizing: false,
    }
  },
  computed: {
    ...mapState(['gitUtil'])
  },
  async created() {
    await this.init()
  },
  watch: {
    async $route() {
      if (this.$route.name === 'backend.theme') {
        await this.init()
      } else {
        // 删除fake style
        let style = document.head.querySelector('#fake-markdown-style');
        if (style) {
          style.remove()
        }
      }
    },
    async scss() {
      let style = document.head.querySelector('#fake-markdown-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'fake-markdown-style';
        document.head.appendChild(style);
      }
      await Sass.compile(this.scss, (res) => {
        if (res)
          style.innerHTML = res.text
      });
    }
  },
  methods: {
    async init() {
      let res = await getText(`${staticFolder}/markdown.scss`);
      if (res[0]) {
        this.scss = res[1];
        if (this.codeMirror) {
          this.codeMirror.setValue(this.scss)
        }
      } else {
        this.$message.error('获取markdown.scss失败!请检查网络')
      }
      if (!this.codeMirror) {
        this.codeMirror = new CodeMirror(this.$refs.textarea, {
          indentUnit: 2,
          tabSize: 2,
          theme: 'idea',
          lineNumbers: true,
          line: true,
          mode: 'sass',
        });
        this.codeMirror.on('change', () => {
          this.scss = this.codeMirror.getValue()
        });
        this.codeMirror.setValue(this.scss);
      }
    },
    startResize (){
      let vue_ = this;
      let parentLeft = this.$refs.text.getBoundingClientRect().x,
          parentWidth = this.$refs.text.clientWidth;
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
    reset (){
      if (!this.codeMirror) return;
      this.codeMirror.setValue(defaultMarkdownStyle);
    },
    async save() {
      if (this.gitUtil) {
        this.saving = true;
        let res = await this.gitUtil.updateTheme(this.scss, this.scss);
        if (res[0]) {
          this.$message.success('保存成功!');
        } else {
          this.$message.error(parseAjaxError(res[1]));
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
.theme {
  width: 95%;
  height: 100%;
  background: white;
  border-radius: 0.6rem;
  margin: auto;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.4);
  flex-direction: column;

  > .head {
    width: 100%;
    height: 3rem;
    justify-content: space-between;

    > .loading-button {
      margin: 0.2rem;
      &:first-of-type{
        background: #ff7e7e;
        &:hover{
          background: #e77272;
        }
      }
    }
  }

  > .body {
    width: 100%;
    height: calc(100% - 3rem);
    flex-grow: 0;

    > .edit {
      width: calc(100% - 0.5rem);
      align-items: stretch;
      margin: 0.5rem 0.25rem 0.5rem 0.25rem;
      height: calc(100% - 1rem);
      border: 1px solid;

      > .left, > .right {
        height: 100%;
        flex-direction: column;

        > .icon {
          width: 100%;
          justify-content: center;
          padding: 0.4rem 0;
          background: #3e3e3e;

          > svg {
            width: 1.5rem;
            height: 1.5rem;
          }

          > span {
            font-size: 0.9rem;
            margin-left: 1rem;
            color: white;
          }
        }
      }

      > .left {
        flex-shrink: 0;

        > .icon > a {
          margin-left: 1rem;

          > svg {
            width: 1.2rem;
            height: 1.2rem;
            fill: #91ffbd;
          }
        }

        > .textarea {
          font-size: 0.8rem;
          width: 100%;
          height: 100%;
          overflow-y: auto;

          > ::v-deep .CodeMirror {
            height: 100%;
            line-height: 1.2rem;
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
      > .right {
        flex-grow: 1;
        width: 0;

        > div {
          border-left: none;
          overflow-y: auto;
          width: 100%;
          overflow-x: auto;

          > span {
            display: block;
            padding: 0.4rem;
            width: calc(100% - 0.8rem) !important;
          }
        }
      }
    }
  }
}
</style>