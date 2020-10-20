import {cdnDynamicUrl} from "@/need";
import siteConfig from "@/site-config";

const showdown = require('showdown');
const converter = new showdown.Converter({
    prefixHeaderId: '__markdown_header_id_',
    tables: true,
    tasklists: true,
    backslashEscapesHTMLTags: true,
    parseImgDimensions: true
});

export function parseMarkdown(text) {
    text = text
        // target=_blank
        .replace(/(?<=^|[^\\])#\[(.*?)]\((.*?)\)/g, '<a target="_blank" href="$2">$1</a>')
        // sticker
        .replace(/(?<=^|[^\\])!\[sticker]\((aru|yellow-face)\/(\d+)\)/g, `<img alt="sticker" src="${cdnDynamicUrl}/sticker/$1/$2.png?ran=${siteConfig.timeStamp}"/>`)
        // dimension image
        .replace(/(?<=^|[^\\])!\[(.*?) x (.*?)]\((.*?)\)/g, (a, b, c, d) => {
            return `<img alt="dimension img" style="${b !== 'null' ? `width: ${b} !important;` : ''}${c !== 'null' ? `height: ${c} !important;` : ''}" src="${d}"/>`
        })
    return converter.makeHtml(text)
}
