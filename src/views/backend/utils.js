import {parseDate} from "@/filter";

export function setCache (key, val){
    window.localStorage.setItem('cache-'+key, val)
}

export function getCache (key){
    return window.localStorage.getItem('cache-'+key)
}

export function delCache (key){
    return window.localStorage.removeItem('cache-'+key)
}

// ************************************

const siteConfig = require( '@/site-config')

export function genRss (items){
    items = items.slice(0, siteConfig.rss.count)
    const origin = location.origin;
    function escapeXml (s){
        return s.toString().replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
    }
    function createEl (tag, html, notEscape){
        const el = xml.createElement(tag);
        if (html) {
            el.innerHTML = notEscape?html:escapeXml(html);
        }
        return el;
    }

    const xml = new DOMParser().parseFromString('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>', "application/xml");
    const rss = xml.getElementsByTagName('rss')[0];

    const channel = createEl('channel', '');
    channel.appendChild(createEl('title', `${siteConfig.owner}的博客`))
    channel.appendChild(createEl('link', origin))
    channel.appendChild(createEl('description', `${siteConfig.owner}的博文Rss`))
    channel.appendChild(createEl('category', siteConfig.rss.categories))
    channel.appendChild(createEl('lastBuildDate', parseDate(new Date().getTime(), false)));
    channel.appendChild(createEl('language', 'zh-cn'))

    for (const i of items){
        const item = createEl('item');
        item.appendChild(createEl('author', siteConfig.owner));
        item.appendChild(createEl('title', i.name));
        item.appendChild(createEl('link', origin+'/article/'+i.file));
        item.appendChild(createEl('description', `
            <h3><b>${i.name}</b></h3>
            <span style="display: block">${i.summary}</span>
            <img src="${i.cover}" alt=""/>
        `, true));
        item.appendChild(createEl('pubDate', parseDate(i.modifyTime, false)));
        item.appendChild(createEl('guid', i.time));

        channel.appendChild(item);
    }

    rss.appendChild(channel);
    return new XMLSerializer().serializeToString(xml);
}
