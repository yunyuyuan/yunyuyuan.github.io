<template>
  <div class="theme" flex>
    <div class="head" flex>
      <loading-button :loading="saving" :icon="'save'" :text="'保存'" @click.native="save"/>
    </div>
    <div class="body" flex>
      <div class="edit" flex>
        <div class="left">
          <span class="icon" flex>
            <svg-icon :name="'edit'"/>
            <span>编辑scss</span>
          </span>
          <div>
            <div class="textarea" ref="textarea"></div>
          </div>
        </div>
        <div class="right">
          <span class="icon" flex>
            <svg-icon :name="'brash'"/>
            <span>效果</span>
          </span>
          <div ref="markdown" flex>
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


export default {
  name: "Theme",
  components: {LoadingButton},
  data() {
    return {
      saving: false,
      scss: '',
      html: parseMarkdown(testText),
      codeMirror: null
    }
  },
  computed: {
    ...mapState(['gitUtil'])
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
      line: true
    });
    this.codeMirror.on('change', () => {
      this.scss = this.codeMirror.getValue()
    })
    this.codeMirror.setValue(this.scss)
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
        style.id = 'fake-markdown-style'
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
  min-height: 90%;
  background: white;
  border-radius: 0.6rem;
  margin: 1rem auto;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.4);
  flex-direction: column;

  > .head {
    width: 100%;
    justify-content: space-between;

    > .loading-button {
      margin: 0.2rem 0.2rem 0.2rem auto;
    }
  }

  > .body {
    width: 100%;

    > .edit {
      width: calc(100% - 1rem);
      align-items: stretch;
      margin: 1rem 0.5rem;
      padding-bottom: 3rem;

      > .left, > .right {
        width: 50%;

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

        > div {
          border: 1px solid gray;
          height: 100%;
          align-items: stretch;
        }
      }

      > .left {
        align-items: stretch;

        > div {
          border-right: 1px dashed black;

          > .textarea {
            font-size: 0.8rem;
            width: 100%;
            height: 100%;

            > ::v-deep .CodeMirror {
              height: 100%;
              line-height: 1.2rem;
            }
          }
        }
      }

      > .right {
        > .icon {
          border-left: 1px solid white;
        }

        > div {
          border-left: none;

          > span {
            padding: 0.4rem;
          }
        }
      }
    }
  }
}
</style>