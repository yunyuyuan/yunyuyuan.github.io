import siteConfig from '@/./site-config'

const isDev = process.env.NODE_ENV === 'development';
export const
    baseDynamicUrl = isDev?'':(siteConfig.cdn+'/dynamic'),
    originPrefix = location.origin.replace(/([^/])$/, '$1/') + (isDev?'':'dynamic');

import '@/icons'
import '@/filter'
