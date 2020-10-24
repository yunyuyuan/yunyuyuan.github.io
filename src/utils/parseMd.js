import {hljsAndInsertCopyBtn} from "@/utils/highlight";
import anchorImg from '!!file-loader!@/icons/svg/anchor.svg'
import checkImg from '!!file-loader!@/icons/svg/checked.svg'
import uncheckImg from '!!file-loader!@/icons/svg/unchecked.svg'
import markerImg from '!!file-loader!@/icons/svg/marker.svg'

const
    linkExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])#\[(.*?)]\((.*?)\)/g,
        replace: '<a target="_blank" href="$2">$1</a>'
    },
    dimensionExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])!\[(.*?) x (.*?)]\((.*?)\)/g,
        replace: (a, b, c, d) => {
            return `<img alt="dimension img" style="${b !== '*' ? `width: ${b} !important;` : ''}${c !== '*' ? `height: ${c} !important;` : ''}margin: 1rem;display: inline-block" src="${d}"/>`
        }
    },
    colorTextExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])-\(([#a-zA-Z0-9]+): (.*?)\)-/g,
        replace: `<span style="color: $1">$2</span>`
    },
    fieldExtension = {
        type: 'lang',
        filter (text, converter){
            return text.replace(/(?:^|\n)--(.*?)--\n([\s\S]+)\n-- --/g, (a, b, c)=>{
                return `<fieldset><legend>${b}</legend>${converter.makeHtml(c)}</fieldset>`
            })
        },
    }

const showdown = require('showdown');
const options = {
    prefixHeaderId: '__markdown_header_id_',
    tables: true,
    tasklists: true,
    backslashEscapesHTMLTags: true,
    strikethrough: true
}
const converter = new showdown.Converter({
    ...options,
    extensions: [linkExtension, dimensionExtension, colorTextExtension, fieldExtension]
});

export function parseMarkdown(text) {
    return converter.makeHtml(text)
}

// 二次处理html
export function processMdHtml (el){
    // hljs
    el.querySelectorAll('pre>code:not(.hljs)').forEach(el=>{
      hljsAndInsertCopyBtn(el)
    })
    // anchor
    el.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(el => {
      el.innerHTML = `<img src="${anchorImg}"/>${el.innerHTML}`
    })
    // ul
    el.querySelectorAll('ul>li:not(.task-list-item)').forEach(el=>{
      el.innerHTML = `<img src="${markerImg}"/>${el.innerHTML}`
    })
    // ol
    el.querySelectorAll('ol').forEach(el=>{
        let start = +(el.getAttribute('start')||1);
        el.children.forEach(sub=>{
            sub.setAttribute('data-count', start);
            start ++;
        })
    })
    // viewer
    el.querySelectorAll('img[alt]:not([alt=sticker])').forEach(el=>{
      el.setAttribute('data-viewer', '')
    })
    // task
    el.querySelectorAll('input[type=checkbox]').forEach(el=>{
        let span = document.createElement('img');
        span.src = el.checked?checkImg:uncheckImg;
        el.parentElement.insertBefore(span, el);
        el.remove();
    })
}
