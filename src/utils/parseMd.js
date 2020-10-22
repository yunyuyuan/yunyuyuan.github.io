const
    delExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])~~(.*?)~~/g,
        replace: '<del>$1</del>'
    },
    linkExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])#\[(.*?)]\((.*?)\)/g,
        replace: '<a target="_blank" href="$2">$1</a>'
    },
    colorTextExtension = {
        type: 'lang',
        regex: /(?:^|[^\\])-\(([#a-zA-Z0-9]+): (.*?)\)-/g,
        replace: '<span style="color: $1">$2</span>'
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
    parseImgDimensions: true
}
const converter = new showdown.Converter({
    ...options,
    extensions: [delExtension, linkExtension, colorTextExtension, fieldExtension]
});

export function parseMarkdown(text) {
    return converter.makeHtml(text)
}
