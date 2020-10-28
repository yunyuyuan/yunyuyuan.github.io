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
    const origin = location.origin;
    const xmlString = "<root></root>";
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const rss = createEl('rss', '', {version: '2.0'});

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
        item.appendChild(createEl('description', i.summary));
        item.appendChild(createEl('pubDate', parseDate(i.modifyTime, false)));
        item.appendChild(createEl('guid', i.time));

        channel.appendChild(item);
    }

    rss.appendChild(channel);
    return rss.outerHTML;
}

function createEl (tag, html, attrs){
    const el = document.createElement(tag);
    if (html) {
        el.innerHTML = html;
    }
    if (attrs){
        for (const k in attrs){
            el.setAttribute(k, attrs[k]);
        }
    }
    return el;
}