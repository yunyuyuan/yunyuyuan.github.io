export function setCache (key, val){
    window.localStorage.setItem('cache-'+key, val)
}

export function getCache (key){
    return window.localStorage.getItem('cache-'+key)
}