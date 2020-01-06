let path;
$(document).ready(function () {
    listen_scroll();

    path = document.getElementById('-head-container').getAttribute('data-path');
    let root = $(document.documentElement);
    let int = parseInt(root.css("--base-interval").replace('px'));
    let body_size = [document.body.clientWidth, document.body.clientHeight];
    // 蓝天
    let sky_bg = document.getElementById('-head-bg');
    let sky_canvas = document.getElementById("-head-canvas"),
        sky_ctx = sky_canvas.getContext('2d'),
        sky_canvas_size = [sky_canvas.clientWidth, sky_canvas.clientHeight],
        sky_sun = new Image(),
        sky_moon = new Image(),
        sky_now = sky_sun,
        sun_size = 10*int,
        sun_speed = 600,
        sun_pos = [0, sky_canvas_size[1]];
    sky_canvas.setAttribute('width', sky_canvas_size[0].toString());
    sky_canvas.setAttribute('height', sky_canvas_size[1].toString());
    sky_sun.src = path+'/static/img/animate/sun.png';
    sky_moon.src = path+'/static/img/animate/moon.png';
    //云
    let cloud_list = [],
        cloud_arr_list = [],
        cloud_cate = 4,
        cloud_count = calc_cloud_count();

    // 初始化云
    for (let i = 0; i < cloud_cate; i++) {
        cloud_list[i] = new Image();
        cloud_arr_list[i] = [];
        cloud_list[i].src = path+'/static/img/animate/cloud' + i + '.png';
        for (let cloud = 0; cloud < cloud_count; cloud++) {
            cloud_arr_list[i][cloud] = [parseInt(Math.random() * sky_canvas_size[0]), parseInt(Math.random() * (sky_canvas_size[1]-12*int)), random_cloud_size(), random_cloud_speed()];
        }
    }

    // 雪
    let snow_div = document.getElementById("snow-div"),
        snow_count = calc_snow_count(),
        snow_list = [];

    function make_snow(i) {
        let snow = [new Image(), Math.random()*body_size[0], Math.random()*body_size[1], 0, (Math.random()-0.5)*2, Math.random()*2+1, Math.random()*10+5, Math.random() * 4*int + 4*int];
        snow[0].src = path+'/static/img/animate/snow' + i%3 + '.png';
        snow[0].style.width = snow[7]+'px';
        snow[0].style.height = snow[7]+'px';
        snow_list[snow_list.length] = snow;
        snow_div.append(snow[0]);
    }

    // 初始化雪花
    for (let i=0;i<snow_count;i++){
        make_snow(i)
    }
    // 开始
    setInterval(function() {
        // 太阳
        sky_ctx.clearRect(0, 0, sky_canvas_size[0], sky_canvas_size[1]);
        sun_pos[0] = sun_pos[0]+sky_canvas_size[0]/sun_speed;
        let half_width = sky_canvas_size[0]/2;
        sun_pos[1] = sky_canvas_size[1]*(sun_pos[0]-half_width)*(sun_pos[0]-half_width)/(half_width*half_width);
        // 中午
        if (sun_pos[0] > sky_canvas_size[0]/5){
            sky_bg.style.background = 'linear-gradient(to bottom, rgba(53, 115, 202, 0.9), rgba(100, 169, 234, 0.9))';
        }
        // 黄昏
        if (sun_pos[0] > sky_canvas_size[0]*3/5){
            sky_bg.style.background = 'linear-gradient(to bottom, rgba(112, 51, 42, 0.9), rgba(225, 126, 67, 0.9))';
        }
        // 夜晚
        if (sun_pos[0] > sky_canvas_size[0]*4/5){
            sky_now = sky_moon;
            sky_bg.style.background = 'linear-gradient(to bottom, rgba(11, 11, 19, 0.9), rgba(38, 43, 65, 0.9))';
        }
        // 到头
        if (sun_pos[0] > sky_canvas_size[0]){
            sun_pos = [0, sky_canvas_size[1]];
            sky_now = sky_sun;
            sky_bg.style.background = 'linear-gradient(to bottom, rgba(116, 170, 232, 0.9), rgba(175, 201, 226, 0.9))';
        }
        sky_ctx.drawImage(sky_now, sun_pos[0]-sun_size/2, sun_pos[1]-sun_size/2, sun_size, sun_size);
        // 云
        for (let i = 0; i < cloud_cate; i++) {
            for (let cloud = 0; cloud < cloud_count; cloud++) {
                // x移动
                cloud_arr_list[i][cloud][0] -= cloud_arr_list[i][cloud][3];
                // 超出边界, 从头开始
                if (cloud_arr_list[i][cloud][0] < -cloud_arr_list[i][cloud][2]) {
                    cloud_arr_list[i][cloud] = [sky_canvas_size[0] + cloud_arr_list[i][cloud][2], parseInt(Math.random() * (sky_canvas_size[1]-60)), random_cloud_size(), random_cloud_speed()];
                }
                sky_ctx.drawImage(cloud_list[i], cloud_arr_list[i][cloud][0], cloud_arr_list[i][cloud][1], cloud_arr_list[i][cloud][2], cloud_arr_list[i][cloud][2]);
            }
        }
        // 雪花
        for (let i=0;i<snow_list.length;i++) {
            snow_list[i][1] += snow_list[i][4];
            snow_list[i][2] += snow_list[i][5];
            if (-snow_list[i][7] > snow_list[i][1] || snow_list[i][1] > (body_size[0]+snow_list[i][7]) || snow_list[i][2] > (body_size[1]+snow_list[i][7])){
                snow_list[i][1] = Math.random()*body_size[0];
                snow_list[i][2] = -snow_list[i][7];
            }
            snow_list[i][3] += snow_list[i][6];
            snow_list[i][3] %= 360;
            snow_list[i][0].style.left = snow_list[i][1]+'px';
            snow_list[i][0].style.top = snow_list[i][2]+'px';
            snow_list[i][0].style.transform = 'rotate('+snow_list[i][3]+'deg)';
        }
    }, 50);
    // 随机大小
    function random_cloud_size() {
        return parseInt(Math.random() * 10*int) + 12*int;
    }
    // 随机速度
    function random_cloud_speed() {
        return Math.random() * 1.5 + 0.5;
    }

    window.onresize = function () {
        let old_size = body_size;
        body_size = [document.body.clientWidth, document.body.clientHeight];
        //改变天空canvas大小
        sky_canvas_size = [sky_canvas.clientWidth, sky_canvas.clientHeight];
        sky_canvas.setAttribute('width', sky_canvas_size[0].toString());
        sky_canvas.setAttribute('height', sky_canvas_size[1].toString());
        // 根据位置比例调整云和太阳位置
        sun_pos[0] = sun_pos[0]*body_size[0]/old_size[0];
        for (let i = 0; i < cloud_cate; i++) {
            for (let cloud = 0; cloud < cloud_count; cloud++) {
                cloud_arr_list[i][cloud][0] = cloud_arr_list[i][cloud][0]*body_size[0]/old_size[0];
            }
        }
        // 调整云数
        cloud_count = calc_cloud_count();
        let old_length = cloud_arr_list[0].length;
        // 多删少补
        if (old_length >= cloud_count){
            for (let i=0;i<cloud_cate;i++) {
                cloud_arr_list[i] = cloud_arr_list[i].slice(0, cloud_count);
            }
        }else{
            for (let i=0;i<cloud_cate;i++) {
                for (let r = old_length; r < cloud_count; r++) {
                    cloud_arr_list[i][r] = [parseInt(Math.random() * sky_canvas_size[0]), parseInt(Math.random() * (sky_canvas_size[1]-12*int)), random_cloud_size(), random_cloud_speed()];
                }
            }
        }

        snow_count = calc_snow_count();
        let old_list_size = snow_list.length;
        if (old_list_size > snow_count){
            let int = old_list_size - snow_count;
            for (let i=0;i<int;i++){
                snow_list[0][0].remove();
                snow_list = snow_list.slice(1, snow_list.length+1);
            }
        }else{
            let int = snow_count - old_list_size;
            for (let i=0;i<int;i++){
                make_snow(i)
            }
        }
    };
    // 计算数量
    function calc_cloud_count() {
        if (root.css('--head-height').replace(' ', '') === '100px') {
            return parseInt(body_size[0]/600);
        } else {
            return parseInt(body_size[0]/800);
        }
    }
    function calc_snow_count() {
        if (root.css('--head-height').replace(' ', '') === '100px') {
            return parseInt((body_size[0] / 25) * (body_size[1] / 1200));
        } else {
            return parseInt((body_size[0] / 35) * (body_size[1] / 2000));
        }
    }

    let state = $('#login-wrap > b');
    // 登录
    let login_div = $('#login-div');
    $('#-head-login > img').click(function () {
        login_div.fadeIn(200);
    });
    // 登出
    $('#login-wrap> button').click(function () {
        state.text('处理中...');
        $.ajax({
            success: function () {
                location.reload();
            },
            url: path+'/publicAction', type: 'POST', timeoutSeconds: 10,
            data: {'type': 'logout'}
        })
    });

    // Github登录  服务器产生随机代码,保证非滥用
    $('#login-with-github').click(function () {
        state.text('处理中...');
        let temp_win = window.open('_blank');
        $.ajax({
            success: function (r) {
                if (r.length !== 0){
                    temp_win.location.href = "https://github.com/login/oauth/authorize?client_id=Iv1.588e073872ef9d4d&redirect_uri=http://blog.ohhhh.top/githubbind&state="+r;
                }else{
                    state.text('处理失败')
                }
            }, error: function (e) {
                state.text(e.state()+' 服务器错误')
            }, complete: function () {
                setTimeout(function(){state.text('')}, 2500);
            },
            url: path+'/publicAction', type: 'POST', timeoutSeconds: 10,
            data: {'type': 'get-github-code'}
        });
    });

    // 侧边栏
    let fold_host = $('#fold-host');
    let host = $('#host');
    let show_wrap = $('#show-wrap');
    fold_host.click(function () {
        if (host.css('left') === '0px'){
            fold_host.css('transform', 'rotate(-90deg)');
            root.css('--host-left', '-'+host.width()+'px');
            show_wrap.css('width', '100%');
            localStorage.fold = '1';
        }else{
            fold_host.css('transform', 'rotate(90deg)');
            root.css('--host-left', '0');
            show_wrap.css('width', 'calc(100% - 150px)');
            localStorage.fold = '0';
        }
    });

    // 监听滚动
    $(window).scroll(listen_scroll);
    function listen_scroll() {
        let to_top_img =  $("#to-top-img");
        if (document.body.scrollTop > document.body.clientHeight){
            to_top_img.css('visibility', 'unset');
            to_top_img.stop(false, false, true).fadeIn(200);
        }else {
            to_top_img.stop(false, false, true).fadeOut(200, 'linear', function(){to_top_img.css({'display': 'unset', 'visibility': 'hidden'})});
        }
    }
});