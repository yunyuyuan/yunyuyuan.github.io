const siteConfig = require( '@/site-config')

const isDev = process.env.NODE_ENV === 'development';
export const
    cdnDynamicUrl = isDev?'':(siteConfig.cdn+'/dynamic'),
    originPrefix = location.origin + (isDev?'':'/dynamic');

import '@/icons'
import '@/filter'
import '@/assets/style/source-code-pro.css'
import '@/assets/style/write-font.css'
import 'viewerjs/dist/viewer.css'

document.head.querySelectorAll('link.icon-link').forEach(el=> {
    el.href = `${originPrefix}/${siteConfig.avatar}?stamp=${siteConfig.timeStamp}`
})