$(document).ready(function() {
    initialize_page();
    var experience_id = get_id();
    get_experience_detail(experience_id);
    get_experiences_comment_paging(experience_id, 1) // 评论分页

    // 评论文章
    $("#experience_comments_btn").click(function() {
        var experience_comments_ctt = $('#experience_comments_ctt').val();
        var datas = get_json({ 'ctype': 3, 'comment': experience_comments_ctt, 'fid': experience_id })
        $.ajax({
            type: 'post',
            url: get_url("/comment/new"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 评论成功, 局部刷新评论内容，待做
                    get_experiences_comment_paging($('#experience_id').val(), 1)

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
        var user_like_status = 1; // 0点赞，1取消
        if ($("#user_likes").attr("style") != "color:#f7726b") {
            user_like_status = 0;
        }
        var datas = get_json({ 'ctype': 3, 'status': user_like_status, 'gid': experience_id })
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
                        $('#experience_likes').text(Number($('#experience_likes').text()) + 1);
                        // 点赞失败
                    } else {
                        $("#user_likes").attr("style", "");
                        $('#experience_likes').text(Number($('#experience_likes').text()) - 1);
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
        var user_like_status = 1; // 0点赞，1取消
        if ($("#user_collectons").attr("style") != "color:#f7726b") {
            user_like_status = 0; // 未点赞
        }
        var datas = get_json({ 'ctype': 3, 'status': user_like_status, 'cid': experience_id })
        $.ajax({
            type: 'post',
            url: get_url("/usercollections"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (user_like_status == 0) {
                    $("#user_collectons").attr("style", "color:#f7726b");
                    $('#experience_collectons').text(Number($('#experience_collectons').text()) + 1);
                    // 点赞失败
                } else {
                    $("#user_collectons").attr("style", "");
                    $('#experience_collectons').text(Number($('#experience_collectons').text()) - 1);
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
function get_experience_detail(id) {
    $.ajax({
        type: 'get',
        url: get_url("/get/article?aid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic)
                var author_infomation = datas.userinfo

                var experience_reading = 456; // 阅读量
                var experience_comments = 456; // 评论量
                var experience_likes = datas.goods; // 点赞数
                var experience_collectons = datas.collections; // 收藏量

                var experience_id = datas.id; // 文章id
                var experience_title = datas.title; // 标题
                var experience_creattime = datas.times; // 创建时间
                var experience_content = datas.content; // 简介
                var experience_imag_url = get_img_url(datas.ximg); // 文章图片

                // 判断是否可以修改
                $('#author_name').text(author_name); // 作者名
                $('#author_infomation').text(author_infomation); // 个性签名
                $('#author_headpic').attr("src", author_headpic); //头像

                // 个人中心跳转
                $('#author_name').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_name').attr("style", "cursor:pointer;"); //头像
                $('#author_headpic').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_headpic').attr("style", "cursor:pointer;"); //头像

                $('#title').text(experience_title); // 文章标题
                $('#experience_id').attr("value", experience_id); // 文章id
                $('#experience_content').html(experience_content); // 文章内容

                // 判断是否为该作者，如果是就有修改的权限，如果不是则不显示
                if (author_id == get_user_info("user_userid")) {
                    $("#edit").attr("href", "experience_edit.html?id=" + experience_id);
                    $("#edit").show();
                }

                $('#experience_likes').text(experience_likes); // 评论数
                $('#experience_reading').text(experience_reading); // 评论数
                $('#experience_comments').text(experience_comments); // 评论数
                $('#experience_collectons').text(experience_collectons); // 评论数
                $('#experience_creattime').text(experience_creattime); // 创建时间

                // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮，待做
                var user4_status = get_user4_status(3, id);
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




// 教程分页内容
function get_experiences_comment_paging(id, pagenum) {
    var fid = id; // 文章id
    var ctype = 3; // 0教程 1提问 2灵感 3文章
    var pagenum = pagenum; // 分页数

    var datas = get_json({ "fid": fid, "ctype": ctype, "pagenum": pagenum })
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/getcomments?pagenum=" + pagenum),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var counts = str.data.counts;
                var datas = str.data.contentlist;
                var content = '<p class="comment-title">' +
                    '<span>全部评论</span><span class="num">' + counts + '</span>' +
                    '</p>';
                for (var i = 0; i < datas.length; i++) {
                    var author_id = datas[i].uid;
                    var author_name = datas[i].nickname
                    var author_infomation = datas[i].userinfo
                    var author_headpic = get_img_url(datas[i].headpic)

                    var experience_id = datas[i].id; // 文章id
                    var experience_comment = datas[i].comment; // 简介
                    var experience_creattime = datas[i].times;
                    var conment_id = datas[i].id;

                    // 判断是否可以修改
                    var c = '<div class="comment-item">' +
                        '<div class="img-box">' +
                        '<img src="' + author_headpic + '" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;" />' +
                        '</div>' +
                        '<div class="comment-item-info">' +
                        '<div class="info">' +
                        '<div class="first-comment">' +
                        '<div class="user">' +
                        '<p class="name" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</p>' +
                        '</div>' +
                        '<div class="date">' + experience_creattime + '</div>' +
                        '<p class="word" style="word-break:break-all;">' + experience_comment + '</p>' +
                        '<div class="info-other">' +
                        '<div class="operate">' +
                        '<label><span title="评论" class="glyphicon glyphicon-comment"></span> 评论</label>' +
                        '<label><span title="点赞" class="glyphicon glyphicon-thumbs-up star"></span>点赞</label>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c
                    if (i == 0) {
                        $("#repeat_cid").attr("value", conment_id);
                    }
                }
                $('#comment').html(content);
                $('#total').attr("value", counts);
                compute_pagenum(pagenum, "get_experiences_comment_paging", $('#experience_id').val())



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