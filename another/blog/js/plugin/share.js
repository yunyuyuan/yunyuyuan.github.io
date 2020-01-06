$(document).ready(function () {
    // 改变颜色
    let change_mod_span = document.getElementById('change-mod');
    let chosen='';
    if (change_mod_span !== undefined) {
        change_mod_span.addEventListener('click', function() {
            let root = $(document.documentElement);
            if (change_mod_span.className === 'black') {
                root.css('--container-color', 'rgba(255, 255, 255, 0.9)');
                root.css('--font-color', 'black');
                document.body.className = 'white-mod';
                change_mod_span.className = 'white';
                change_mod_span.innerText = '暗';
                chosen = 'white';
            } else {
                root.css('--container-color', 'rgba(43, 43, 43, 0.9)');
                root.css('--font-color', 'white');
                document.body.className = '';
                change_mod_span.className = 'black';
                change_mod_span.innerText = '亮';
                chosen = 'black';
            }
            localStorage.color_mod = chosen;
        });
    }
    // 检查登录
    let head = $('#-head-container');
    let login_id = head.attr("data-login-id");
    let login_pf = head.attr("data-login-pf");
    if (login_id !== 'null' && login_id !== undefined){
        if (login_pf === "github"){
            login_by_github(login_id, function (data_id, re) {
                $('#-head-login > img').attr('src', re['avatar_url']);
                $('#login-wrap > img').attr('src', re['avatar_url']);
                $('#-head-container').attr('data-login-name', data_id);
                $('#login-wrap > span').text(data_id+",您已登录");
            });
        }
    }
    // 左边栏跟随
    let host = $('#host');
    if (host[0] !== undefined){
        let body_wrap = document.getElementById('body-wrap');
        $(window).scroll(function () {
            let head_height = parseInt($(document.documentElement).css('--head-height').replace('px'));
            if (document.body.scrollTop < body_wrap.offsetHeight-host[0].offsetHeight+head_height) {
                let calc_top = document.body.scrollTop - head_height;
                if (calc_top >= 0){
                    host.css('top', calc_top + 'px');
                }
            }
        })
    }
});
// 请求管理员
function enter_manage(pwd, callback) {
    $.ajax({
        complete: function () {
            if (typeof callback === "function"){
                callback();
            }
        },
        url: $('#-head-container').attr('data-path')+'/verify_manager', type: 'POST', timeoutSeconds: 10,
        data: {'pwd': pwd}
    })
}
// 到顶
function to_top() {
    $('body,html').animate({scrollTop: 0}, 300);
}
// 初始化颜色
function init_color() {
    let color_mod = localStorage.getItem("color_mod");
    let container_color = "rgba(43, 43, 43, 0.9)";
    let font_color = "white";
    let mod = "";
    if (color_mod!=null && color_mod==="white") {
        container_color = "rgba(255, 255, 255, 0.9)";
        font_color = "black";
        mod = "white-mod";
    }
    $(document.documentElement).css('--container-color', container_color);
    $(document.documentElement).css('--font-color', font_color);
    $(document.body).addClass(mod);
}