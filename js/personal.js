$(document).ready(function() {
    initialize_page();
    set_copyright_version();

    $('#uid').attr("value", get_id());
    get_user_infos(get_id());
    get_user_dt_list(1);


    // 提问
    $("#get_articles").click(function() {
        $("#answering_list").html('');
        get_articles_list(1);
    });

    // 动态
    $("#get_user_dt").click(function() {
        $("#answering_list").html('');
        get_user_dt_list(1);
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
                var fans = str.data.fens;
                var follows = str.data.follows;

                $('#find_password1').attr("onclick", "go_update_password(" + uid + ")")
                $('#find_password2').attr("onclick", "go_update_password(" + uid + ")")

                // 头像
                // $('#headpic1').attr("src", headpic);
                $('#headpic').attr("style", " no-repeat center top;background-size:cover; cursor:pointer;");
                $('#headpic').attr("src", headpic);

                // 背景相关
                $("#backgroud").attr("onclick", "go_personal_backgroud(" + uid + ")");
                $('#personal-header').attr("style", 'background: url("' + titlepic + '") no-repeat center top;background-size:100% 100%; cursor:pointer;height:500px;');

                // 用户信息
                $('#username').text(nickname);
                $('#userinfo').text(userinfo);
                $('#fans').text(fans);
                $('#fanslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 0 + ")");

                $('#follows').text(follows);
                $('#followslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 1 + ")");

                // 自己是编辑个人资料，其他人是关于，其中关注显示已关注和取消关注
                if (get_user_info("user_userid") == uid) {
                    $('#update_user_info').attr("href", 'personal_info.html?uid=' + $('#uid').val());
                } else {

                    // 是粉丝显示取消关注，不是显示关注
                    if (get_user_is_fans(uid) == "已关注") {
                        $('#update_user_info').text("取消关注");
                        $('#update_user_info').attr("name", "取消关注"); //接下来就是取消关注
                        $('#update_user_info').removeAttr("target");
                        $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    } else {
                        $('#update_user_info').text("关注");
                        $('#update_user_info').attr("name", "关注"); //1已关注
                        $('#update_user_info').removeAttr("target");
                        $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    }
                }


                return str.data;
            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)
            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
}


// 获取动态列表
function get_user_dt_list(nums) {
    var uid = $('#uid').val();
    var user_infos;

    $("#get_questsion").attr("style", "");
    $("#question_num").attr("style", "");
    $("#get_articles").attr("style", "");
    $("#article_num").attr("style", "");
    $("#get_inspiration").attr("style", "");
    $("#inspiration_num").attr("style", "");
    $("#get_user_dt").attr("style", "color:#f7726b");
    $("#dt_num").attr("style", "color:#f7726b");

    //获取用户信息
    $.ajax({
        type: 'get',
        url: get_url("/get/userinfo?uid=" + uid),
        async: false,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                user_infos = str.data;
            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)
            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });

    //获取动态
    $.ajax({
        type: 'get',
        url: get_url("/getuserdt?pagenum=" + nums + "&uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var content = '';
                var datas = str.data.userlist;
                var counts = str.data.counts;
                for (var i = 0; i < datas.length; i++) {
                    var c = '';
                    var imgs = "";

                    var id = datas[i].id;
                    var dt = datas[i].dt;
                    var ximg = datas[i].ximg;
                    var ctype = datas[i].ctype;
                    var times = datas[i].times;
                    var title = datas[i].title;
                    // 教程
                    if (ctype == 0) {
                        t = 'go_tutorial_details';
                        imgs = '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                            '<img src="' + get_img_url(ximg) + '" style="background-size:cover; overflow: hidden;width:256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                            '</div>';
                    }
                    // 问题
                    if (ctype == 1) {
                        t = 'go_question_details';
                        imgs = '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                            '<img src="' + get_img_url(ximg) + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                            '</div>';
                    }
                    //  灵感
                    if (ctype == 2) {
                        t = 'go_inspiration_details';
                        var imgs_str = ximg.split(",");
                        for (j = 0; j < imgs_str.length; j++) {
                            imgs = imgs + '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                                '<img src="' + get_img_url(imgs_str[j]) + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                                '</div>';
                        }
                        imgs = imgs + '</div></div>';

                    }
                    // 心得体会：文章
                    if (ctype == 3) {
                        t = 'go_experience_details(' + id + ')';
                        imgs = '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                            '<img src="' + get_img_url(ximg) + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                            '</div>';
                    }

                    c = '<div class="list-item">' +
                        '<div class="title"><span>' + dt + '</span><span>' + times + '</span></div>' +
                        '<div class="user-box">' +
                        '<div class="img-box">' +
                        '<img src="' + get_img_url(user_infos.userinfo[0].headpic) + '" alt="这是头像">' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name">' + user_infos.userinfo[0].nickname + '</p>' +
                        '<div class="info-other">' +
                        '<p class="job">' + user_infos.userinfo[0].userinfo + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div style="cursor:pointer;" onclick="' + t + '(' + id + ')">' +
                        '<p style="padding-top:10px;">' + title + '</p>' +
                        '<div style="padding-top: 10px; display: flex;justify-content: flex-start;justify-content: space-between;">' + imgs +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    content = content + c;


                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#dt_num').text("(" + counts + ")");
                user_compute_pagenum(nums, "get_user_dt_list", uid, -10000)

            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
}

// 获取问题列表
function get_questions_list(nums) {

    $("#get_articles").attr("style", "");
    $("#article_num").attr("style", "");
    $("#get_inspiration").attr("style", "");
    $("#inspiration_num").attr("style", "");
    $("#get_user_dt").attr("style", "");
    $("#dt_num").attr("style", "");
    $("#get_questsion").attr("style", "color:#f7726b");
    $("#question_num").attr("style", "color:#f7726b");

    var uid = $('#uid').val();
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

                    // c = '<div class="list-item" onclick="go_question_details(' + experience_id + ')"  style="cursor:pointer;">' +
                    //     '<div class="title">' +
                    //     '<span>发起了问题</span>' +
                    //     '<span>' + experience_creattime + '</span>' +
                    //     '</div>' +
                    //     '<p class="desc">' + experience_title + '</p>' +
                    //     '<div class="apply">' +
                    //     '<div class="user-box">' +
                    //     '<div class="img-box avatar">' +
                    //     '<img src="' + author_headpic + '" alt="" />' +
                    //     '</div>' +
                    //     '<div class="info">' +
                    //     '<p class="name">' + author_name + '</p>' +
                    //     '<p class="job">' + author_infomation + '</span></p>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '<div class=" apply-word">' +
                    //     '<div class="desc">' +
                    //     '<p class="desc-word">' + experience_content + '</p>' +
                    //     '<div data-status="0" class="more">' +
                    //     '<span>...</span><span class="cf7"> 查看更多</span><span class="glyphicon glyphicon-triangle-bottom cf7"></span>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>'

                    c = '<div class="list-item">' +
                        '<div class="title"><span>发表了问题</span><span>' + experience_creattime + '</span></div>' +
                        '<div class="user-box">' + '<div class="img-box"><img src="' + author_headpic + '" alt="这是头像"></div>' +
                        '<div class="info"><p class="name">' + author_name + '</p><div class="info-other">' +
                        '<p class="job">' + author_infomation + '</p></div></div></div>' +
                        '<div style="cursor:pointer;" onclick="go_question_details(' + experience_id + ')"><p style="padding-top:10px;">' + experience_title + '</p>' +
                        '<div style="padding-top: 10px; display: flex;justify-content: flex-start;justify-content: space-between;">' +
                        '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                        '<img src="' + experience_imag_url + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                        '</div></div></div></div>'

                    content = content + c;

                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#question_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_questions_list", uid, -10000)

            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
}


// 获取文章列表
function get_articles_list(nums) {
    var uid = $('#uid').val()

    $("#get_user_dt").attr("style", "");
    $("#dt_num").attr("style", "");
    $("#get_questsion").attr("style", "");
    $("#question_num").attr("style", "");
    $("#get_inspiration").attr("style", "");
    $("#inspiration_num").attr("style", "");
    $("#get_articles").attr("style", "color:#f7726b");
    $("#article_num").attr("style", "color:#f7726b");
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

                    // c = '<div class="list-item" onclick="go_experience_details(' + experience_id + ')"  style="cursor:pointer;">' +
                    //     '<div class="title">' +
                    //     '<span>发起了问题</span>' +
                    //     '<span>' + experience_creattime + '</span>' +
                    //     '</div>' +
                    //     '<p class="desc">' + experience_title + '</p>' +
                    //     '<div class="apply">' +
                    //     '<div class="user-box">' +
                    //     '<div class="img-box avatar">' +
                    //     '<img src="' + author_headpic + '" alt="" />' +
                    //     '</div>' +
                    //     '<div class="info">' +
                    //     '<p class="name">' + author_name + '</p>' +
                    //     '<p class="job">' + author_infomation + '</span></p>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '<div class=" apply-word">' +
                    //     '<div class="desc">' +
                    //     '<p class="desc-word">' + experience_content + '</p>' +
                    //     '<div data-status="0" class="more">' +
                    //     // '<span>...</span><span class="cf7"> 查看更多</span><span class="glyphicon glyphicon-triangle-bottom cf7"></span>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>'
                    c = '<div class="list-item">' +
                        '<div class="title"><span>发表了问题</span><span>' + experience_creattime + '</span></div>' +
                        '<div class="user-box">' + '<div class="img-box"><img src="' + author_headpic + '" alt="这是头像"></div>' +
                        '<div class="info"><p class="name">' + author_name + '</p><div class="info-other">' +
                        '<p class="job">' + author_infomation + '</p></div></div></div>' +
                        '<div style="cursor:pointer;" onclick="go_experience_details(' + experience_id + ')"><p style="padding-top:10px;">' + experience_title + '</p>' +
                        '<div style="padding-top: 10px; display: flex;justify-content: flex-start;justify-content: space-between;">' +
                        '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                        '<img src="' + experience_imag_url + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                        '</div></div></div></div>'

                    content = content + c;
                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#article_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_articles_list", uid, -10000)

            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
}

// 获取灵感列表
function get_inspirations_list(nums) {

    $("#get_articles").attr("style", "");
    $("#article_num").attr("style", "");
    $("#get_user_dt").attr("style", "");
    $("#dt_num").attr("style", "");
    $("#get_questsion").attr("style", "");
    $("#question_num").attr("style", "");
    $("#get_inspiration").attr("style", "color:#f7726b");
    $("#inspiration_num").attr("style", "color:#f7726b");

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
                    var imgs = "";
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
                    var experience_imag_url = datas[i].ximg; // 文章图片

                    c = '<div class="list-item"><div class="title"><span>发表了灵感</span><span>' + experience_creattime + '</span></div><div class="user-box"><div class="img-box">' +
                        '<img src="' + author_headpic + '" alt="这是头像"></div><div class="info"><p class="name">' + author_name + '</p><div class="info-other">' +
                        '<p class="job">' + author_infomation + '</p></div></div></div><div style="cursor:pointer;" onclick="go_inspiration_details(' + experience_id + ')">' +
                        '<p style="padding-top:10px;">' + experience_content + '</p><p><br></p><p></p>' +
                        '<div style="padding-top: 10px; display: flex;justify-content: flex-start;justify-content: space-between;">';
                    var imgs_str = experience_imag_url.split(",");
                    for (j = 0; j < imgs_str.length; j++) {
                        imgs = imgs + '<div class="img-box1" style="overflow: hidden;width: 256px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;">' +
                            '<img src="' + get_img_url(imgs_str[j]) + '" style="background-size:cover; overflow: hidden;width: 256px; height:162px;display: flex;align-items: center;justify-content: flex-start;justify-content: center;" alt="">' +
                            '</div>';
                    }

                    c = c + imgs + '</div></div></div>'
                    content = content + c;
                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#inspiration_num').text("(" + counts + ")");

                user_compute_pagenum(nums, "get_inspirations_list", uid, -10000)

            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
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