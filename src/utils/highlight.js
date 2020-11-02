import hljs from "highlight.js";

export function hljsAndInsertCopyBtn (el){
    let btn = document.createElement('span');
    addCopyEvent(el.parentElement, btn, el.classList[0], el.innerText);
    el.parentElement.insertBefore(btn, el);
    hljs.highlightBlock(el);
}

export function addCopyEvent (pre, btn, lang, code){
    btn.innerText = lang;
    pre.onmouseenter = ()=>{btn.innerText = '复制'}
    pre.onmouseleave = ()=>{btn.innerText = lang}
    btn.onclick = ()=>{
        let textArea = document.createElement("textarea");
        textArea.style.maxHeight = '0';
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        btn.innerText = '复制成功'
    }
}