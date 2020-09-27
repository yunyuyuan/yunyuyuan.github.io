<template>
  <div class="write" flex>
    <div class="inner" flex>
      <div class="textarea" ref="textarea" :style="{height: textareaHeight}"></div>
      <div class="utils" flex>
        <div class="sticker" ref="sticker" :class="{active: showSticker}" flex>
          <div class="content">
            <div class="inner" :style="{width: `${config.sticker.length}00%`, left: `${stickerSlideNow*-100}%`}" flex>
              <div v-for="item in config.sticker" :style="{width: `${100/config.sticker.length}%`}" flex>
                <span v-for="idx in item.count" @click="addSticker(item.folder, idx)" flex>
                  <img :src="`${staticFolder}/sticker/${item.folder}/${idx}.png`"/>
                </span>
              </div>
            </div>
          </div>
          <div class="switch" flex>
            <span v-for="(item, idx) in config.sticker" @click="stickerSlideNow = idx"
                  :class="{active: stickerSlideNow===idx}" flex>{{ item.name }}</span>
          </div>
        </div>
        <a class="md" @click="showGuide = true" title="关于markdown" flex>
          <svg-icon :name="'markdown'"/>
        </a>
        <span @click="enableSticker" title="表情" :class="{active: showSticker}" flex>
          <svg-icon :name="'cmt-sticker'"/>
        </span>
        <span @click="enableUploadImg" title="图片" :class="{active: showUploadImg}" flex>
          <svg-icon :name="'cmt-image'"/>
        </span>
        <span @click="enablePreview" title="预览" :class="{active: showPreview}" flex>
          <svg-icon :name="'cmt-preview'"/>
        </span>
      </div>
      <resizer :orient="'v'" @start="startResize" @resize="doResize"/>
      <div class="submit" flex>
        <float-input class="nick" @input="inputNick" :size="0.8" :name="'昵称'" :value="nick"/>
        <float-input class="site" @input="inputSite" :size="0.8" :name="'网址'" :value="site"/>
        <loading-button @click.native="submitComment" :loading="loading" :icon="'save'" :text="'提交'"/>
      </div>
    </div>
    <div class="preview" v-show="showPreview">
      <span class="--markdown" v-html="html"></span>
    </div>
    <div class="upload-img" v-show="showUploadImg">

    </div>
    <markdown-help v-show="showGuide" @click.native.self="showGuide=false"/>
  </div>
</template>

<script>
import FloatInput from "@/components/FloatInput";
import LoadingButton from "@/components/LoadingButton";
import {parseMarkdown} from "@/utils";
import Resizer from "@/components/Resizer";

import CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown'

import 'codemirror/lib/codemirror.css';
import '@/assets/style/code-mirror/codeMirror.scss';

import '@/assets/style/code-mirror/light-markdown.scss';
import '@/assets/style/code-mirror/dracula-markdown.scss';
import {mapState} from "vuex";
import {staticFolder} from "@/main";
import MarkdownHelp from "@/views/block/MarkdownHelp";

export default {
  name: "WriteComment",
  components: {MarkdownHelp, Resizer, LoadingButton, FloatInput},
  props: ['loading'],
  data() {
    return {
      staticFolder,
      comment: '',
      showGuide: false,
      showSticker: false,
      showUploadImg: false,
      showPreview: false,
      stickerSlideNow: 0,
      nick: '',
      site: '',
      codeMirror: null,
      focusAt: 0,
      textareaHeight: '10rem',
      resizeStart: {
        pos: false,
        size: false
      },
    }
  },
  computed: {
    ...mapState(['config']),
    html (){
      return parseMarkdown(this.comment)
    }
  },
  mounted() {
    this.codeMirror = new CodeMirror(this.$refs.textarea, {
      indentUnit: 2,
      tabSize: 2,
      theme: 'light',
      line: true,
      mode: 'markdown',
    });
    this.codeMirror.on('change', () => {
      this.comment = this.codeMirror.getValue()
    });
    this.codeMirror.on('blur', () => {
      this.focusAt = this.codeMirror.getCursor();
    })
  },
  methods: {
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
    addSticker(folder, idx) {
      if (!this.focusAt) {
        this.$message.warning('请先点击输入框!');
        return
      }
      this.codeMirror.replaceRange(`![sticker](${folder}/${idx})`, this.focusAt);
      document.removeEventListener('click', this.handleStickerDiv);
      this.showSticker = false;
    },
    enableUploadImg() {

    },
    enablePreview() {
      this.showPreview = !this.showPreview;
    },
    startResize(startPos) {
      this.resizeStart = {
        pos: startPos,
        size: this.$refs.textarea.scrollHeight
      };
    },
    doResize(delta) {
      let newSize = this.resizeStart.size + (delta - this.resizeStart.pos);
      if (newSize > 100 && newSize < 1000) {
        this.textareaHeight = `${newSize}px`;
      }
    },
    inputNick(r) {
      this.nick = r[1]
    },
    inputSite(r) {
      this.site = r[1]
    },
    async submitComment() {
      this.$emit('submit', {
        nick: this.nick,
        site: this.site,
        text: this.comment
      })
    }
  },
}
</script>

<style scoped lang="scss">
.write {
  flex-direction: column;
  width: 80%;
  border-radius: 0.4rem;
  >.inner{
    width: calc(100% - 2px);
    flex-direction: column;
    border: 1px solid #a5a5a5;
    border-radius: inherit;
    align-items: stretch;
    &:hover{
      border-color: #ff3700;
    }
    >.textarea{
      border-radius: 0.4rem 0.4rem 0 0;
      >::v-deep .CodeMirror{
        width: 100%;
        height: 100%;
        border-radius: inherit;
        font-size: 0.9rem;
      }
    }
    >.utils{
      justify-content: flex-end;
      padding: 0.2rem;
      border-top: 1px dashed gray;
      position: relative;
      >.sticker{
        width: 90%;
        position: absolute;
        left: 5%;
        bottom: 105%;
        border-radius: 0.2rem;
        height: 0;
        background: white;
        flex-direction: column;
        z-index: 10;
        overflow: hidden;
        transition: height .1s linear;
        &.active{
          height: 40vh;
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
            >div{
              height: 100%;
              overflow-y: auto;
              flex-wrap: wrap;
              >span{
                width: 4rem;
                height: 4rem;
                border: 1px solid #d8d8d8;
                cursor: pointer;
                background: white;
                justify-content: center;
                &:hover{
                  background: #e6e6e6;
                  >img{
                    transform: scale(1.1);
                  }
                }
                >img{
                  transition: transform .1s ease-out;
                  width: 70%;
                  height: 70%;
                  object-fit: contain;
                }
              }
            }
          }
        }
        >.switch{
          width: 100%;
          height: 2rem;
          border-top: 1px solid #676767;
          background: #ececec;
          >span{
            height: 100%;
            font-size: 0.9rem;
            justify-content: center;
            width: 4rem;
            border-right: 1px solid #b5b5b5;
            cursor: pointer;
            &:not(.active):hover{
              background: #bababa;
            }
            &.active{
              background: #333333;
              color: white;
            }
          }
        }
      }
      >.md{
        cursor: pointer;
        margin: 0 auto 0 0.5rem;
        &:hover{
          >svg{
            fill: #a100ff
          }
        }
        >svg{
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      >span{
        cursor: pointer;
        margin: 0 0.3rem;
        border-radius: 0.2rem;
        justify-content: center;
        padding: 0.3rem 0.7rem;
        &.active{
          background: #999cff;
        }
        &:not(.active):hover{
          background: #cbcbcb;
        }
        >svg{
          width: 1.6rem;
          height: 1.6rem;
        }
      }
    }
    > ::v-deep .resizer{
      background: #828282;
      height: 0.3rem;
      flex-shrink: 0;
      &[resizing]{
        background: #505050;
      }
    }
    >.submit{
      padding: 0.8rem 0;
      justify-content: flex-end;
      >.nick{
        margin: 0 10%;
        width: 30%;
      }
      >.site{
        margin: 0 10%;
        width: 60%;
      }
      > .loading-button{
        margin-right: 1rem;
        flex-shrink: 0;
      }
    }
  }
  > .preview{
    width: 100%;
    max-height: 50rem;
    overflow-y: auto;
    border-bottom: 1px solid #cc00ff;
    > span{
      padding: 0.5rem 0.2rem;
      width: calc(100% - 1rem);
    }
  }
  > .upload-img{
  }
}
</style>