$(document).ready(function() {
    initialize_page();
    $('#uid').attr("value", get_user_id());
    get_user_infos(get_user_id());
    // get_user_info();
    get_questions_list(1);



    // 提问
    $("#get_articles").click(function() {
        $("#answering_list").html('');
        get_articles_list(1);
    });
    // 提问
    $("#get_questsion").click(function() {
        $("#answering_list").html('');
        get_questions_list(1);
    });

    // 灵感
    $("#get_inspiration").click(function() {
        $("#answering_list").html('');
        get_inspirations_list(1);
    });

});

function get_user_infos(uid) {
    $.ajax({
        type: 'get',
        url: get_url("/get/userinfo?uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var userinfo = str.data.userinfo[0].userinfo
                var nickname = str.data.userinfo[0].nickname
                var headpic = get_img_url(str.data.userinfo[0].headpic)
                var titlepic = get_img_url(str.data.userinfo[0].titlepic)
                var fensi = str.data.fens;
                var guanzhu = str.data.follows;

                $('#headpic1').attr("src", headpic);
                $('#headpic').attr("src", headpic);
                $('#personal-header').attr("style", 'background: url("' + titlepic + '") no-repeat center top;background-size:cover');

                $('#username').text(nickname);
                $('#userinfo').text(userinfo);
                $('#fensi').text(fensi);
                $('#guanzhu').text(guanzhu);

            } else {
                alert("推荐教程获取失败！");
                remove_user_login_status(str.msg)
            }

        },
        fail: function(err, status) {
            alert("推荐教程获取失败！");
            console.log(err);
        }
    });
}


// 获取问题列表
function get_questions_list(nums) {
    var uid = $('#uid').val()

    $.ajax({
        type: 'get',
        url: get_url("/userquestions?pagenum=" + nums + "&uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_name = datas[i].nickname
                    var author_headpic = get_img_url(datas[i].headpic)
                    var author_infomation = datas[i].userinfo

                    var experience_reading = 456; // 阅读量
                    var experience_comments = 456; // 评论量
                    var experience_likes = datas[i].goods; // 点赞数
                    var experience_collectons = datas[i].collections; // 收藏量

                    var experience_id = datas[i].id; // 文章id
                    var experience_title = datas[i].title; // 标题
                    var experience_content = datas[i].content; // 内容
                    var experience_creattime = datas[i].times; // 创建时间
                    var experience_imag_url = get_img_url(datas[i].ximg); // 文章图片

                    c = '<div class="list-item" onclick="go_questions_details(' + experience_id + ')">' +
                        '<div class="title">' +
                        '<span>发起了问题</span>' +
                        '<span>' + experience_creattime + '</span>' +
                        '</div>' +
                        '<p class="desc">' + experience_title + '</p>' +
                        '<div class="apply">' +
                        '<div class="user-box">' +
                        '<div class="img-box avatar">' +
                        '<img src="' + author_headpic + '" alt="" />' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</span></p>' +
                        '</div>' +
                        '</div>' +
                        '<div class=" apply-word">' +
                        '<div class="desc">' +
                        '<p class="desc-word">' + experience_content + '</p>' +
                        '<div data-status="0" class="more">' +
                        '<span>...</span><span class="cf7"> 查看更多</span><span class="glyphicon glyphicon-triangle-bottom cf7"></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c;

                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#question_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_questions_list", uid, -10000)

            } else {
                alert("推荐教程获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("推荐教程获取失败！");
            console.log(err);
        }
    });
}


// 获取文章列表
function get_articles_list(nums) {
    var uid = $('#uid').val()

    $.ajax({
        type: 'get',
        url: get_url("/userarticle?pagenum=" + nums + "&uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_name = datas[i].nickname
                    var author_headpic = get_img_url(datas[i].headpic)
                    var author_infomation = datas[i].userinfo

                    var experience_reading = 456; // 阅读量
                    var experience_comments = 456; // 评论量
                    var experience_likes = datas[i].goods; // 点赞数
                    var experience_collectons = datas[i].collections; // 收藏量

                    var experience_id = datas[i].id; // 文章id
                    var experience_title = datas[i].title; // 标题
                    var experience_content = datas[i].brief; // 内容
                    var experience_creattime = datas[i].times; // 创建时间
                    var experience_imag_url = get_img_url(datas[i].ximg); // 文章图片

                    c = '<div class="list-item" onclick="go_experience_details(' + experience_id + ')">' +
                        '<div class="title">' +
                        '<span>发起了问题</span>' +
                        '<span>' + experience_creattime + '</span>' +
                        '</div>' +
                        '<p class="desc">' + experience_title + '</p>' +
                        '<div class="apply">' +
                        '<div class="user-box">' +
                        '<div class="img-box avatar">' +
                        '<img src="' + author_headpic + '" alt="" />' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</span></p>' +
                        '</div>' +
                        '</div>' +
                        '<div class=" apply-word">' +
                        '<div class="desc">' +
                        '<p class="desc-word">' + experience_content + '</p>' +
                        '<div data-status="0" class="more">' +
                        // '<span>...</span><span class="cf7"> 查看更多</span><span class="glyphicon glyphicon-triangle-bottom cf7"></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c;
                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#article_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_articles_list", uid, -10000)

            } else {
                alert("推荐教程获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("推荐教程获取失败！");
            console.log(err);
        }
    });
}

// 获取灵感列表
function get_inspirations_list(nums) {
    var uid = $('#uid').val()


    $.ajax({
        type: 'get',
        url: get_url("/userinspirer?pagenum=" + nums + "&uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_name = datas[i].nickname
                    var author_headpic = get_img_url(datas[i].headpic)
                    var author_infomation = datas[i].userinfo

                    var experience_reading = 456; // 阅读量
                    var experience_comments = 456; // 评论量
                    var experience_likes = datas[i].goods; // 点赞数
                    var experience_collectons = datas[i].collections; // 收藏量

                    var experience_id = datas[i].id; // 文章id
                    var experience_title = datas[i].title; // 标题
                    var experience_content = datas[i].content; // 内容
                    var experience_creattime = datas[i].times; // 创建时间
                    var experience_imag_url = get_img_url(datas[i].ximg); // 文章图片

                    c = '<div class="list-item" onclick="go_inspiration_details(' + experience_id + ')">' +
                        '<div class="title">' +
                        '<span>发表了灵感</span>' +
                        '<span>' + experience_creattime + '</span>' +
                        '</div>' +
                        // '<p class="desc">' + experience_title + '</p>' +
                        '<div class="apply">' +
                        '<div class="user-box">' +
                        '<div class="img-box avatar">' +
                        '<img src="' + author_headpic + '" alt="" />' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</span></p>' +
                        '</div>' +
                        '</div>' +
                        '<div class=" apply-word">' +
                        '<div class="desc">' +
                        '<p class="desc-word">' + experience_content + '</p>' +
                        '<div data-status="0" class="more">' +
                        // '<span>...</span><span class="cf7"> 查看更多</span><span class="glyphicon glyphicon-triangle-bottom cf7"></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c;
                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#inspiration_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_inspirations_list", uid, -10000)

            } else {
                alert("推荐教程获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("推荐教程获取失败！");
            console.log(err);
        }
    });
}


// 跳转到心得体会（文章）
function go_experience_details(aid) {
    window.location.href = "experience_detail.html?aid=" + aid;
}

// 跳转到提问列表
function go_questions_details(aid) {
    window.location.href = "question_detail.html?aid=" + aid;
}

// 跳转到灵感列表
function go_inspiration_details(id) {
    window.location.href = "inspiration_detail.html?id=" + id;
}


function get_user_id() {
    return window.location.href.split('=')[1].replace('#', '');
}

// 是否显示回复框
function show_repeat_div(id) {
    var status = $("#q" + id).css('display');
    if (status == 'none') {
        $("#q" + id).show();
    } else {
        $("#q" + id).hide();
    }
}

// 回复问题
function repeat_experience(id) {
    var experience_id = id;
    var repeat_content = $("#q" + experience_id).val();
    var datas = get_json({ "ctype": 1, "comment": repeat_content, "fid": experience_id });
    $.ajax({
        type: 'post',
        url: get_url("/comment/new"),
        headers: get_headers(),
        data: datas,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 回复成功
                alert("评论成功")
                go_experience_details(experience_id)
            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
}