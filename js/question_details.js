$(document).ready(function() {
    initialize_page();
    set_copyright_version();

    var question_id = get_id();
    get_question_detail(question_id);
    get_comments_paging(question_id, 1, 1) // 评论分页
    $("#all_search").keyup(function(e) {
        if (e.which == 13) {
            all_search()
        }
    });

    // 评论文章
    $("#question_comments_btn").click(function() {
        var question_comments_ctt = $('#question_comments_ctt').val();
        var datas = get_json({ 'ctype': 1, 'comment': question_comments_ctt, 'fid': question_id })
        $.ajax({
            type: 'post',
            url: get_url("/comment/new"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    $('#question_comments_ctt').val('');
                    get_comments_paging($('#question_id').val(), 1, 1)

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
    });


    // 点赞
    $("#user_likes").click(function() {
        is_need_login();

        var user_like_status = 1; // 0点赞，1取消
        if ($("#user_likes").attr("style") != "color:#f7726b") {
            user_like_status = 0;
        }
        var datas = get_json({ 'ctype': 1, 'status': user_like_status, 'gid': question_id })
        $.ajax({
            type: 'post',
            url: get_url("/userfellgoods"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 评论成功, 局部刷新评论内容
                    // 点赞成功
                    if (user_like_status == 0) {
                        $("#user_likes").attr("style", "color:#f7726b");
                        $('#question_likes').text(Number($('#question_likes').text()) + 1);
                        // 点赞失败
                    } else {
                        $("#user_likes").attr("style", "");
                        $('#question_likes').text(Number($('#question_likes').text()) - 1);
                    }

                } else {
                    alert(str.msg);
                    remove_user_login_status(str.msg);
                }

            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

    // 收藏
    $("#user_collectons").click(function() {
        is_need_login();

        var user_like_status = 1; // 0点赞，1取消
        if ($("#user_collectons").attr("style") != "color:#f7726b") {
            user_like_status = 0; // 未点赞
        }

        var datas = get_json({ 'ctype': 1, 'status': user_like_status, 'cid': question_id })
        $.ajax({
            type: 'post',
            url: get_url("/usercollections"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (user_like_status == "0") {
                    $("#user_collectons").attr("style", "color:#f7726b");
                    $('#question_collectons').text(Number($('#question_collectons').text()) + 1);
                    // 点赞失败
                } else {
                    $("#user_collectons").attr("style", "");
                    $('#question_collectons').text(Number($('#question_collectons').text()) - 1);
                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

});


// 获取教程列表
function get_question_detail(id) {
    $.ajax({
        type: 'get',
        url: get_url("/get/question?qid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic)
                var author_infomation = datas.userinfo

                var question_reading = 456; // 阅读量
                var question_comments = 456; // 评论量
                var question_likes = datas.goods; // 点赞数
                var question_collectons = datas.collections; // 收藏量

                var question_id = datas.id; // 文章id
                var question_title = datas.title; // 标题
                var question_creattime = datas.times; // 创建时间
                var question_content = datas.content; // 简介
                var question_imag_url = get_img_url(datas.ximg); // 文章图片

                // 判断是否可以修改
                $('#fengmianimg').attr("src", question_imag_url);

                $('#author_name').text(author_name); // 作者名
                $('#author_infomation').text(author_infomation); // 个性签名
                $('#author_headpic').attr("src", author_headpic); //头像

                // 个人中心跳转
                $('#author_name').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_name').attr("style", "cursor:pointer;"); //头像
                $('#author_headpic').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_headpic').attr("style", "cursor:pointer;"); //头像

                $('#question_title').text(question_title); // 文章标题
                $('#question_id').attr("value", question_id); // 文章id
                $('#question_content').html(question_content); // 文章内容


                // 判断是否为该作者，如果是就有修改的权限，如果不是则不显示
                if (author_id == get_user_info("user_userid")) {
                    $(".other").append('<div class="other-item other-icon"><a style="color: #f7726b;font-size: 15px;" href="question_edit.html?id=' + question_id + '">修改</a></div>')
                    $(".other").append('<div class="other-item other-icon"><a style="color: #f7726b;font-size: 15px;" href="javascript:void(0);" onclick="delete_questsion(' + question_id + ')">删除</a></div>')
                }
                $('#question_likes').text(question_likes); // 评论数
                $('#question_reading').text(question_reading); // 评论数
                $('#question_comments').text(question_comments); // 评论数
                $('#question_collectons').text(question_collectons); // 评论数
                $('#question_creattime').text(question_creattime); // 创建时间

                // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮
                var user4_status = get_user4_status(1, id);
                if (user4_status.split(",")[0] == "0") {
                    $("#user_likes").attr("style", "color:#f7726b");
                }
                if (user4_status.split(",")[2] == "0") {
                    $("#user_collectons").attr("style", "color:#f7726b");
                }

            } else {
                alert("获取数据失败！");
                remove_user_login_status(str.msg)

            }
        },
        fail: function(err, status) {
            alert("获取数据失败！");
            console.log(err);
        }
    });
}

// // 教程分页内容
// function get_comments_paging(id, pagenum) {
//     var fid = id; // 文章id
//     var ctype = 1; // 0教程 1提问 2灵感 3文章
//     var pagenum = pagenum; // 分页数

//     var datas = get_json({ "fid": fid, "ctype": ctype, "pagenum": pagenum })
//     $.ajax({
//         type: 'post',
//         data: datas,
//         url: get_url("/getcomments?pagenum=" + pagenum),
//         headers: get_headers(),
//         xhrFields: { withCredentials: true },
//         crossDomain: true,
//         success: function(str) { //返回json结果
//             if (str.status == 200) {
//                 var counts = str.data.counts;
//                 var datas = str.data.contentlist;
//                 var content = '<p class="comment-title">' +
//                     '<span>全部评论</span><span class="num">' + counts + '</span>' +
//                     '</p>';
//                 for (var i = 0; i < datas.length; i++) {
//                     var author_id = datas[i].uid;
//                     var author_name = datas[i].nickname;
//                     var author_infomation = datas[i].userinfo;
//                     var author_headpic = get_img_url(datas[i].headpic);

//                     var question_id = datas[i].id; // 文章id
//                     var question_comment = datas[i].comment; // 简介
//                     var question_creattime = datas[i].times;
//                     var conment_id = datas[i].id;

//                     // 判断是否可以修改
//                     var c = '<div class="comment-item">' +
//                         '<div class="img-box">' +
//                         '<img src="' + author_headpic + '" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;"/>' +
//                         '</div>' +
//                         '<div class="comment-item-info">' +
//                         '<div class="info">' +
//                         '<div class="first-comment">' +
//                         '<div class="user">' +
//                         '<p class="name" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_name + '</p>' +
//                         '<p class="job" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_infomation + '</p>' +
//                         '</div>' +
//                         '<div class="date">' + question_creattime + '</div>' +
//                         '<p class="word" style="word-break:break-all;">' + question_comment + '</p>' +
//                         '<div class="info-other">' +
//                         '<div class="operate">' +
//                         '<label id="first_comment"><span title=" 评论" class="glyphicon glyphicon-comment"></span> 评论</label id="first_comment" >' +
//                         '<label><span title=" 点赞" class="glyphicon glyphicon-thumbs-up star"></span> 点赞</label>' +
//                         '</div>' +
//                         '</div>' +
//                         '</div>' +
//                         '</div>' +
//                         '</div>' +
//                         '</div>'

//                     content = content + c
//                     if (i == 0) {
//                         $("#repeat_cid").attr("value", conment_id);
//                     }
//                 }
//                 $('#comment').html(content);
//                 $('#total').attr("value", counts);
//                 compute_pagenum(pagenum, "get_comments_paging", $('#question_id').val())
//                     // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮，待做
//             } else {
//                 alert("获取数据失败！");
//                 remove_user_login_status(str.msg)

//             }
//         },
//         fail: function(err, status) {
//             alert("获取数据失败！");
//             console.log(err);
//         }
//     });
// }

// 删除灵感
function delete_questsion(id) {
    is_need_login();
    var datas = get_json({ "qid": id });
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/question/delete"),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                go_next_page("question.html");
            } else {
                alert(str.msg);
            }
        },
        fail: function(err, status) {
            alert("获取数据失败！");
            console.log(err);
        }
    });
}