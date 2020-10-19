import siteConfig from '@/site-config'

const isDev = process.env.NODE_ENV === 'development';
export const
    baseDynamicUrl = isDev?'':(siteConfig.cdn+'/dynamic'),
    originPrefix = location.origin + (isDev?'':'/dynamic');

import '@/icons'
import '@/filter'
import '@/assets/style/source-code-pro.css'
import '@/assets/style/write-font.css'
import 'viewerjs/dist/viewer.css'

document.head.querySelector('link[rel=icon]').href = originPrefix+'/favicon.svg?stamp='+siteConfig.timeStamp