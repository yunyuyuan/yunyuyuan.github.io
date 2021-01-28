import {hljsAndInsertCopyBtn} from "@/utils/highlight";
import anchorImg from '!!file-loader!@/icons/svg/anchor.svg'
import checkImg from '!!file-loader!@/icons/svg/checked.svg'
import uncheckImg from '!!file-loader!@/icons/svg/unchecked.svg'
import markerImg from '!!file-loader!@/icons/svg/marker.svg'
import toggleArrow from '!!file-loader!@/icons/svg/toggle-arrow.svg'
import errImage from '@/image/error.jpg'
import siteConfig from '@/site-config'
import {cdnDynamicUrl} from "@/need";
import pangu from 'pangu'

const
    anchorIdExtension = {
        type: 'lang',
        regex: /(^|[^\\])\[#([^#]*?)#]/g,
        replace: '$1<span class="anchor-id" id="anchor-id-$2"></span>'
    },
    anchorRefExtension = {
        type: 'lang',
        regex: /(^|[^\\])\[#(.*?)#([^#]*?)#]/g,
        replace: '$1<a data-anchor-id="anchor-id-$3" class="anchor-id-ref">$2</a>'
    },
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
    writeFontExtension = {
        type: 'lang',
        regex: /(^|[^\\])-\(write-([\d.]+): (.*?)\)-/g,
        replace: `$1<span write-font style="font-size: $2rem">$3</span>`
    },
    htmlExtension = {
        type: 'lang',
        regex: /(^|[^\\])\[html]([\s\S]*?)\[\/html]/g,
        replace: `$1<span class="raw-html">$2</span>`
    },
    fieldExtension = {
        type: 'lang',
        filter(text, converter) {
            return text.replace(/(^|\n)--(.*?)--\n([\s\S]+)\n-- --/g, (a, b, c, d) => {
                return `${b}<fieldset><legend>${c}</legend>${converter.makeHtml(d)}</fieldset>`
            })
        },
    },
    selfSiteUrlExtension = {
        type: 'lang',
        filter(text, converter) {
            return text.replace(/(^|[^\\])(#?){self}\((\d+)\)/g, (a, b, c, d) => {
                let target = '_self'
                if (c === '#'){
                    target = '_blank'
                }
                return `${b}<a target="${target}" data-self-site="${d}" class="self-site-link">
                                <img data-no-viewer src="" alt="cover"/>
                                <span>
                                    <strong></strong>
                                    <span></span>
                                </span>
                            </a>`
            })
        },
    },
    hidableExtension = {
        type: 'lang',
        filter(text, converter) {
            return text.replace(/(^|\n)~~(.*?)~~\n([\s\S]+)\n~~ ~~/g, (a, b, c, d) => {
                return `${b}<div class="hidable" data-hidden>
                                <p onclick="this.parentElement.toggleAttribute('data-hidden')"><img src="${toggleArrow}"/>${c}</p>
                                <span>${converter.makeHtml(d)}</span>
                            </div>`
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
    extensions: [anchorIdExtension, anchorRefExtension, linkExtension, dimensionExtension, colorTextExtension, writeFontExtension,
        htmlExtension, fieldExtension, selfSiteUrlExtension, hidableExtension]
});
const commentConverter = new showdown.Converter({
    ...options,
    extensions: [anchorRefExtension, linkExtension, dimensionExtension, colorTextExtension, writeFontExtension,
        fieldExtension, selfSiteUrlExtension, hidableExtension]
});

export function parseMarkdown(text, isComment) {
    return isComment?commentConverter.makeHtml(text):converter.makeHtml(text)
}

// 二次处理html
export function processMdHtml(el, isComment, mdList) {
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
    if (!isComment){
        // 评论没有anchor
        el.querySelectorAll('h1[id]:not([parsed]), h2[id]:not([parsed]), h3[id]:not([parsed]), h4[id]:not([parsed]), h5[id]:not([parsed]), h6[id]:not([parsed])').forEach(el => {
            el.setAttribute('parsed', '');
            el.innerHTML = `<img src="${anchorImg}"/>${el.innerHTML}`
        })
    }
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
    el.querySelectorAll('img[alt]:not([alt=sticker]):not([data-viewer]):not([data-no-viewer])').forEach(el => {
        el.setAttribute('data-viewer', '')
    })
    // task
    el.querySelectorAll('input[type=checkbox]').forEach(el => {
        const span = document.createElement('img');
        span.src = el.checked ? checkImg : uncheckImg;
        el.parentElement.insertBefore(span, el);
        el.remove();
    })
    // 本站文章链接
    el.querySelectorAll('a[data-self-site].self-site-link').forEach(el=>{
        const articleId = el.getAttribute('data-self-site');
        const item = mdList.find(e=>e.file === articleId)||{};
        el.href = `/article/${articleId}`;
        el.querySelector('img').src = item.cover||errImage;
        el.querySelector('strong').innerText = item.name||'未知标题';
        el.querySelector('span > span').innerText = item.summary||'未知简介';
    })
    // 排版
    pangu.spacingElementByClassName('--markdown')
}
