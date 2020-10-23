import hljs from "highlight.js";

export function hljsAndInsertCopyBtn (el){
    insertCopyBtn(el);
    hljs.highlightBlock(el);
}

export function insertCopyBtn (el){
    let sourceCode = el.innerText;
    let btn = document.createElement('span');
    btn.innerText = el.classList[0];
    btn.onmouseenter = ()=>{btn.innerText = '复制'}
    btn.onmouseleave = ()=>{btn.innerText = el.classList[0]}
    btn.onclick = ()=>{
        let textArea = document.createElement("textarea");
        textArea.style.maxHeight = '0';
        textArea.value = sourceCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        btn.innerText = '复制成功'
    }
    el.parentElement.insertBefore(btn, el);
}
