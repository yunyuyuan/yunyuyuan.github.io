import {cdnDynamicUrl} from "@/need";
import siteConfig from "@/site-config";

const
    delExtension = {
        type: 'lang',
        regex: /(?<=^|[^\\])~~(.*?)~~/g,
        replace: '<del>$1</del>'
    },
    linkExtension = {
        type: 'lang',
        regex: /(?<=^|[^\\])#\[(.*?)]\((.*?)\)/g,
        replace: '<a target="_blank" href="$2">$1</a>'
    },
    stickerExtension = {
        type: 'lang',
        regex: /(?<=^|[^\\])!\[sticker]\((aru|yellow-face)\/(\d+)\)/g,
        replace: `<img alt="sticker" src="${cdnDynamicUrl}/sticker/$1/$2.png?ran=${siteConfig.timeStamp}"/>`
    },
    dimensionExtension = {
        type: 'lang',
        regex: /(?<=^|[^\\])!\[(.*?) x (.*?)]\((.*?)\)/g,
        replace: (a, b, c, d) => {
            return `<img alt="dimension img" style="${b !== 'null' ? `width: ${b} !important;` : ''}${c !== 'null' ? `height: ${c} !important;` : ''}" src="${d}"/>`
        }
    },
    colorTextExtension = {
        type: 'lang',
        regex: /(?<=^|[^\\])-\(([#a-zA-Z0-9]+): (.*?)\)-/g,
        replace: '<span style="color: $1">$2</span>'
    },
    fieldExtension = {
        type: 'lang',
        filter (text, converter){
            return text.replace(/(?<=^|\n)--(.*?)--\n([\s\S]+)\n-- --/g, (a, b, c)=>{
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
    parseImgDimensions: true
}
const converter = new showdown.Converter({
    ...options,
    extensions: [delExtension, linkExtension, stickerExtension, dimensionExtension, colorTextExtension, fieldExtension]
});

export function parseMarkdown(text) {
    return converter.makeHtml(text)
}
