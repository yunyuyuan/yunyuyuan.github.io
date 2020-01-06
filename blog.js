$(document).ready(function () {
    let path = $('#-head-container').attr('data-path');

    let title_input = $('#input-title');
    let content_input = $('#input-content');
    let content_input_focus = 0;
    let left_input = $('#left-input');
    let right_show = $('#right-show');
    $('#body textarea').bind('input propertychange', function(){show_result()});
    // 左键更新位置
    content_input.bind('keydown click focus', function () {
        content_input_focus = getCursorPosition(this);
    });
    // 右键取消样式选择
    content_input.contextmenu(function () {
        $('#select-cate .select-change').each(function () {
            $(this).removeClass('active');
        });
    });

    // 实时显示效果
    function show_result() {
        title_input[0].style.height = title_input[0].scrollTop + title_input[0].scrollHeight + 'px';
        content_input[0].style.height = content_input[0].scrollTop + content_input[0].scrollHeight + 'px';
        right_show.css('height', left_input.css('height'));
        right_show.find('.blog-title > span').html(title_input.val());
        right_show.find('.blog-content > .mark-container').html(content_input.val());
    }
    // 改变文字样式
    let change_list = {
        'new-head': ['\n<span class="mark-head mark-head2 mark-span">\n\n', '\n\n</span>\n'],
        'new-text': ['\n<span class="mark-text mark-text2 mark-span">\n\n', '\n\n</span>\n'],
        'new-ref': ['\n<span class="mark-ref mark-span">\n\n', '\n\n</span>\n'],
        'new-code': ['\n<pre class="mark-code mark-span">\n\n', '\n\n</pre>\n'],
        'to-bold': ['<b>', '</b>'],
        'to-italic': ['<i>', '</i>'],
        'red-code': ['<span class="red-code">', '</span>'],
        'blue-code': ['<span class="blue-code">', '</span>'],
        'green-code': ['<span class="green-code">', '</span>'],
        'to-html': 'encode',
    };
    $('#select-cate .select-change').click(function () {
        let that = $(this);
        if (this.className.search('active') === -1) {
            $('#select-cate .select-change').each(function () {
                $(this).removeClass('active');
            });
            that.addClass('active');
        }else{
            that.removeClass('active');
        }
    });
    // 添加
    $('#new-img').click(function () {
        let s = '<img style="width: 500px;" class="mark-img mark-span" src="" alt=""/>';
        textarea_add(s)
    });
    $('#new-list').click(function () {
        let s = '<ul class="mark-ul">\n<li></li>\n</ul>';
        textarea_add(s)
    });
    $('#new-table').click(function () {
        let s = '<table class="mark-table">\n<tr class="mark-table-h">\n<th></th>\n</tr>\n\n<tr class="mark-table-b">\n<td></td>\n</tr>\n</table>';
        textarea_add(s)
    });
    // 选择的文字
    content_input.select(function () {
        let old_val = content_input.val();
        let mid_val = old_val.substring(content_input[0].selectionStart, content_input[0].selectionEnd);
        let head = old_val.substring(0, content_input[0].selectionStart);
        let tail = old_val.substring(content_input[0].selectionEnd);
        textarea_change(head, mid_val, tail);
    });
    // 处理选择的文字
    function textarea_change(head, mid, tail) {
        let active_id = $('#select-cate span.active').attr('id');
        if (active_id !== undefined) {
            let decorate = change_list[active_id];
            if (decorate === 'encode'){
                content_input.val(head + $('<span>').text(mid).html() + tail);
            }else {
                content_input.val(head + decorate[0] + mid + decorate[1] + tail);
            }
            content_input.css('height', content_input[0].scrollTop + content_input[0].scrollHeight + 'px');
            show_result();
        }
    }
    // 添加元素
    function textarea_add(s) {
        let old_val = content_input.val();
        content_input.val(old_val.substring(0, content_input_focus) + s + old_val.substring(content_input_focus));
        content_input.css('height', content_input[0].scrollTop + content_input[0].scrollHeight + 'px');
        show_result();
    }

    // 切换左右显示
    $('#manipulate div').click(function () {
        let span = this.children[0];
        let class_ = span.className;
        if (class_ === 'show-whole'){
            span.className='show-left';
            right_show.css({'display': 'none'});
            left_input.css({'width': '100%', 'margin-right': '0'});
        }else if (class_ === 'show-left'){
            span.className='show-right';
            right_show.css({'display': 'unset', 'width': '100%'});
            left_input.css({'display': 'none'});
        }else{
            span.className='show-whole';
            right_show.css({'width': '49%'});
            left_input.css({'width': '49%', 'margin-right': '2%', 'display': 'unset'});
        }
    });
    let tag_input = $('#top-input input');
    // 搜索
    $('#manipulate .search').click(function () {
        $.ajax({
            success: function(re){
                if (re === -1) {
                    pwd = prompt("输入密码", "");
                    enter_manage(pwd);
                }else{
                    title_input.val(re['title']);
                    content_input.val(re['content']);
                    tag_input.val(re['tag']);
                    show_result();
                }
            },
            url: path+'/manage', type: 'POST', timeoutSeconds: 10, dataType: 'json',
            data: {"type": "get_blog", "id": $('#manipulate input').val()}
        });
    });
    // 提交
    $('#manipulate .submit').click(function () {
        process_({"type": "add_blog", "title": title_input.val(), "content": content_input.val(), "tag": tag_input.val()});
    });
    // 修改
    $('#manipulate .modify').click(function () {
        process_({"type": "modify_blog", "title": title_input.val(), "content": content_input.val(), "tag": tag_input.val(), "id": $('#manipulate input').val()});
    });
    // 删除
    $('#manipulate .delete').click(function () {
        process_({"type": "delete_blog", "id": $('#manipulate input').val()});
    });
    function process_(dict) {
        $.ajax({
            success: function(re){
                re = parseInt(re);
                if (re === -1) {
                    pwd = prompt("输入密码", "");
                    enter_manage(pwd);
                }else if (re === 1){
                    alert("成功!");
                }else if (re === 0){
                    alert("失败!");
                }
            },
            url: path+'/manage', type: 'POST', timeoutSeconds: 10,
            data: dict
        });
    }
});
function getCursorPosition(element) {
    let el = $(element).get(0);
    let pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        let Sel = document.selection.createRange();
        let SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}