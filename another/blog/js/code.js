$(document).ready(function () {
    $('.copy-all').click(function () {
        $('.copy-src')[0].select();
        document.execCommand('copy');
        alert('复制成功');
    })
});