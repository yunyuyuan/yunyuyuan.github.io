$(document).ready(function () {
    let waiting_flush = false;
    let comment_ul = $('#comment-ul');
    flush_img();
    get_comment();
    let qr_div = $('#qr');
    qr_div.qrcode({width: qr_div.width()*0.85, height: qr_div.height()*0.85, text: qr_div.attr('data-url')});

    let code_img = $('#code');
    let comment_input = $('#send-comment > label textarea');
    code_img.click(flush_img);
    // 刷新验证码
    function flush_img() {
        if (!waiting_flush) {
            waiting_flush = true;
            $.ajax({
                success: function (re) {
                    if (re.search('data:img/jpg;base64,') === 0) {
                        code_img.attr('src', re);
                    }
                }, error: function () {

                }, complete: function () {
                    waiting_flush = false;
                },
                url: path + "/publicAction", type: 'POST', timeoutSeconds: 10,
                dataType: 'text', data: {'type': 'get-code'}
            })
        }
    }
    let remain_b = $('#send-comment > label b');
    // 高度实时变长
    comment_input.bind('input propertychange', function () {
        let remain = 256-comment_input.val().length;
        remain_b.text((remain>=0)? remain:0);
    });

    // 获取评论
    function get_comment(){
        comment_ul.empty();
        $.ajax({
            success: function (re) {
                for (let i=0;i<re.length;i++){
                    let info = re[i];
                    let name = info[0],
                        pf = info[1],
                        content = info[2],
                        create_time = info[3];
                    if (pf === 'github') {
                        login_by_github(name, function (name, r) {
                            set_one_comment(r, content, create_time, i);
                        })
                    }
                }
            },
            url: path+'/commentAction', type: 'POST', timeoutSeconds: 10,
            data: {'type': 'get', 'blog_id': $('#container').attr('data-blog-id')}, dataType: 'json'
        })
    }
    function set_one_comment(re, content, create_time, order){
        let li = document.createElement('li');
        li.style.order = order;

        let comment_head = document.createElement('div');
        comment_head.className = 'comment-head';
        let img = document.createElement('img');
        img.src = re['avatar_url'];
        let name_b = document.createElement('b');
        name_b.innerHTML = re['login'];
        let time = document.createElement('span');
        time.innerText = create_time;
        comment_head.append(img, name_b, time);

        let comment_body = document.createElement('div');
        comment_body.className = 'comment-body';
        let comment_span = document.createElement('span');
        comment_span.innerHTML = content;
        comment_body.append(comment_span);

        li.append(comment_head, comment_body);
        comment_ul[0].append(li);
    }

    // 提交评论
    let state = $('#send-comment div b');
    let input_code = $('#send-comment input');
    let input_comment = $('#send-comment textarea');
    let head = $('#-head-container');
    $('#send-comment button').click(function () {
        if (head.attr('data-login-pf') !== 'null'){
            if(input_code.val().length === 4) {
                let content = input_comment.val();
                if(content.length === 0) {
                    state.text('评论不能为空!');
                    setTimeout(function(){state.text('')}, 2500);
                    return;
                }
                state.text('处理中...');
                $.ajax({
                    success: function (r) {
                        if (r === 1) {
                            state.text('成功');
                            get_comment();
                        } else if (r === 0) {
                            state.text('验证码错误');
                        } else {
                            state.text('失败');
                        }
                    }, error: function (e) {
                        state.text(e.state() + ' 服务器错误');
                    }, complete: function(){
                        setTimeout(function(){state.text('')}, 2500);
                    },
                    url: path + '/commentAction', type: 'POST', timeoutSeconds: 10, dataType: 'json',
                    data: {'type': 'set', 'c': input_code.val(), 'blog_id': $('#container').attr('data-blog-id'), 'name': head.attr('data-login-name'), 'pf': head.attr('data-login-pf'), 'content': content}
                });
            }else{
                state.text('请正确输入验证码!');
                setTimeout(function(){state.text('')}, 2500);
            }
        }else{
            state.text("请先登录后发送评论");
            setTimeout(function(){state.text('')}, 2500);
        }
    });
});