<template>
  <div class="write" flex>
    <div class="inner" flex>
      <div class="textarea" ref="textarea" :style="{height: textareaHeight}"></div>
      <div class="utils" flex>
        <div class="sticker" ref="sticker" :class="{active: showSticker}" flex>
          <div class="content">
            <div class="inner" :style="{width: `${config.sticker.length}00%`, left: `${stickerNow*-100}%`}" flex>
              <div v-for="item in config.sticker" :style="{width: `${100/config.sticker.length}%`}" flex>
                <span v-for="idx in item.count" @click="addSticker(item.folder, idx)" flex>
                  <img :src="`${staticFolder}/sticker/${item.folder}/${idx}.png`"/>
                </span>
              </div>
            </div>
          </div>
          <div class="switch" flex>
            <span v-for="(item, idx) in config.sticker" @click="stickerNow = idx" :class="{active: stickerNow===idx}" flex>{{ item.name }}</span>
          </div>
        </div>
        <a class="md" @click="showGuide = true" title="关于markdown" flex>
          <svg-icon :name="'markdown'"/>
        </a>
        <span @click="enableSticker" title="表情" :class="{active: showSticker}" flex>
          <svg-icon :name="'cmt-sticker'"/>
        </span>
        <span title="图片" flex>
          <svg-icon :name="'cmt-image'"/>
        </span>
        <span title="预览" flex>
          <svg-icon :name="'cmt-preview'"/>
        </span>
      </div>
      <resizer :orient="'v'" @start="startResize" @resize="doResize"/>
      <div class="submit" flex>
        <float-input class="nick" @input="inputNick" :size="0.8" :name="'昵称'" :value="nick"/>
        <float-input class="site" @input="inputSite" :size="0.8" :name="'网址'" :value="site"/>
        <loading-button :loading="submitting" :icon="'save'" :text="'提交'"/>
      </div>
    </div>
    <div class="preview">
      <span v-html="html"></span>
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
  data() {
    return {
      staticFolder,
      comment: '',
      showSticker: false,
      stickerNow: 0,
      showGuide: false,
      nick: '',
      site: '',
      submitting: false,
      codeMirror: null,
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
  },
  methods: {
    enableSticker (e){
      if (this.showSticker){
        document.removeEventListener('click', handle);
        this.showSticker = false;
        return
      }
      this.showSticker = true;
      let vue_ = this,
          stickerDiv = this.$refs.sticker;
      e.stopPropagation();
      function handle (e){
        let target = e.target;
        while (true) {
          if (target !== stickerDiv) {
            target = target.parentElement;
            if (!target){
              document.removeEventListener('click', handle);
              vue_.showSticker = false;
              break;
            }
          }else {
            break
          }
        }
      }
      document.addEventListener('click', handle)
    },
    addSticker (folder, idx){
      console.log(folder, idx)
    },
    startResize (startPos){
      this.resizeStart = {
        pos: startPos,
        size: this.$refs.textarea.scrollHeight
      };
    },
    doResize (delta){
      let newSize = this.resizeStart.size + (delta-this.resizeStart.pos);
      if (newSize > 100 && newSize < 1000){
        this.textareaHeight = `${newSize}px`;
      }
    },
    inputNick(r) {
      this.nick = r[1]
    },
    inputSite(r) {
      this.site = r[1]
    },
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
        font-size: 0.95rem;
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
      >.loading-button{
        margin-right: 1rem;
        flex-shrink: 0;
      }
    }
  }
  >.preview{
    display: none;
  }
}
</style>