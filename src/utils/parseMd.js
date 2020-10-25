import {hljsAndInsertCopyBtn} from "@/utils/highlight";
import anchorImg from '!!file-loader!@/icons/svg/anchor.svg'
import checkImg from '!!file-loader!@/icons/svg/checked.svg'
import uncheckImg from '!!file-loader!@/icons/svg/unchecked.svg'
import markerImg from '!!file-loader!@/icons/svg/marker.svg'
import siteConfig from '@/site-config'
import {cdnDynamicUrl} from "@/need";

const
    linkExtension = {
        type: 'lang',
        regex: /(^|[^\\])#\[(.*?)]\((.*?)\)/g,
        replace: '$1<a target="_blank" href="$3">$2</a>'
    },
    dimensionExtension = {
        type: 'lang',
        regex: /(^|[^\\])!\[(.*?) x (.*?)]\((.*?)\)/g,
        replace: (a, b, c, d, e) => {
            return `${b}<img alt="dimension img" style="${c !== '*' ? `width: ${c} !important;` : ''}${d !== '*' ? `height: ${d} !important;` : ''}margin: 1rem;display: inline-block" src="${e}"/>`
        }
    },
    colorTextExtension = {
        type: 'lang',
        regex: /(^|[^\\])-\(([#a-zA-Z0-9]+): (.*?)\)-/g,
        replace: `$1<span style="color: $2">$3</span>`
    },
    fieldExtension = {
        type: 'lang',
        filter(text, converter) {
            return text.replace(/(^|\n)--(.*?)--\n([\s\S]+)\n-- --/g, (a, b, c, d) => {
                return `${b}<fieldset><legend>${c}</legend>${converter.makeHtml(d)}</fieldset>`
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
export function processMdHtml(el) {
    // sticker
    el.querySelectorAll('img[alt=sticker]:not([parsed])').forEach(el => {
        el.setAttribute('parsed', '');
        const src = el.getAttribute('src');
        el.src = `${cdnDynamicUrl}/sticker/${src.replace(/^(.*?)\/\d*$/, '$1')}/${src.replace(/.*?\/(\d*)$/, '$1')}.png?ran=${siteConfig.timeStamp}`
    })
    // hljs
    el.querySelectorAll('pre>code:not(.hljs)').forEach(el => {
        hljsAndInsertCopyBtn(el)
    })
    // anchor
    el.querySelectorAll('h1[id]:not([parsed]), h2[id]:not([parsed]), h3[id]:not([parsed]), h4[id]:not([parsed]), h5[id]:not([parsed]), h6[id]:not([parsed])').forEach(el => {
        el.setAttribute('parsed', '');
        el.innerHTML = `<img src="${anchorImg}"/>${el.innerHTML}`
    })
    // ul
    function rescueUl (el){
        el.querySelectorAll('ul>li:not(.task-list-item):not([parsed])').forEach(el => {
            el.setAttribute('parsed', '');
            el.innerHTML = `<img src="${markerImg}"/>${el.innerHTML}`;
            rescueUl(el);
        })
    }
    rescueUl(el);
    // ol
    el.querySelectorAll('ol:not([parsed])').forEach(el => {
        el.setAttribute('parsed', '');
        let start = +(el.getAttribute('start') || 1);
        el.children.forEach(sub => {
            sub.setAttribute('data-count', start);
            start++;
        })
    })
    // viewer
    el.querySelectorAll('img[alt]:not([alt=sticker]):not([data-viewer])').forEach(el => {
        el.setAttribute('data-viewer', '')
    })
    // task
    el.querySelectorAll('input[type=checkbox]').forEach(el => {
        let span = document.createElement('img');
        span.src = el.checked ? checkImg : uncheckImg;
        el.parentElement.insertBefore(span, el);
        el.remove();
    })
}
