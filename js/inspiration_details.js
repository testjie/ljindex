$(document).ready(function() {
    initialize_page();
    var inspiration_id = get_id();
    get_inspiration_detail(inspiration_id);
    get_comments_paging(inspiration_id, 2, 1) // 评论分页
    set_copyright_version();

    // 评论文章
    $("#inspiration_comments_btn").click(function() {
        is_need_login();
        var inspiration_comments_ctt = $('#inspiration_comments_ctt').val();
        is_content_not_null(inspiration_comments_ctt);
        var datas = get_json({ 'ctype': 2, 'comment': inspiration_comments_ctt, 'fid': inspiration_id })
        $.ajax({
            type: 'post',
            url: get_url("/comment/new"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    $('#inspiration_comments_ctt').val('');
                    get_comments_paging($('#inspiration_id').val(), 2, 1)

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
        var datas = get_json({ 'ctype': 2, 'status': user_like_status, 'gid': inspiration_id })
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
                        $('#inspiration_likes').text(Number($('#inspiration_likes').text()) + 1);
                        // 点赞失败
                    } else {
                        $("#user_likes").attr("style", "");
                        $('#inspiration_likes').text(Number($('#inspiration_likes').text()) - 1);
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
        var datas = get_json({ 'ctype': 2, 'status': user_like_status, 'cid': inspiration_id })
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
                    $('#inspiration_collectons').text(Number($('#inspiration_collectons').text()) + 1);
                    // 点赞失败
                } else {
                    $("#user_collectons").attr("style", "");
                    $('#inspiration_collectons').text(Number($('#inspiration_collectons').text()) - 1);
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
function get_inspiration_detail(id) {
    $.ajax({
        type: 'get',
        url: get_url("/get/inspirer?iid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic)
                var author_infomation = datas.userinfo

                var inspiration_reading = 456; // 阅读量
                var inspiration_comments = 456; // 评论量
                var inspiration_likes = datas.goods; // 点赞数
                var inspiration_collectons = datas.collections; // 收藏量

                var inspiration_id = datas.id; // 文章id
                var inspiration_title = datas.title; // 标题
                var inspiration_creattime = datas.times; // 创建时间
                var inspiration_content = datas.content; // 简介
                var inspiration_imag_url = get_img_url(datas.ximg); // 文章图片

                // 判断是否可以修改
                $('#fengmianimg').attr("src", inspiration_imag_url);

                $('#author_name').text(author_name); // 作者名
                $('#author_infomation').text(author_infomation); // 个性签名
                $('#author_headpic').attr("src", author_headpic); //头像

                // 个人中心跳转
                $('#author_name').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_name').attr("style", "cursor:pointer;"); //头像
                $('#author_headpic').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                $('#author_headpic').attr("style", "cursor:pointer;"); //头像


                $('#inspiration_title').text(inspiration_title); // 文章标题
                $('#inspiration_id').attr("value", inspiration_id); // 文章id
                $('#inspiration_content').html(inspiration_content); // 文章内容
                // 判断是否为该作者，如果是就有修改的权限，如果不是则不显示
                if (author_id == get_user_info("user_userid")) {
                    $(".other").append('<div class="other-item other-icon"><a style="color: #f7726b;font-size: 15px;" href="inspiration_edit.html?id=' + inspiration_id + '">修改</a></div>')
                    $(".other").append('<div class="other-item other-icon"><a style="color: #f7726b;font-size: 15px;" href="javascript:void(0);" onclick="delete_inspiration(' + inspiration_id + ')">删除</a></div>')
                }
                $('#inspiration_likes').text(inspiration_likes); // 评论数
                $('#inspiration_reading').text(inspiration_reading); // 评论数
                $('#inspiration_comments').text(inspiration_comments); // 评论数
                $('#inspiration_collectons').text(inspiration_collectons); // 评论数
                $('#inspiration_creattime').text(inspiration_creattime); // 创建时间
                // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮
                var user4_status = get_user4_status(2, id);
                if (user4_status.split(",")[0] == "0") {
                    $("#user_likes").attr("style", "color:#f7726b");
                }
                if (user4_status.split(",")[2] == "0") {
                    $("#user_collectons").attr("style", "color:#f7726b");
                }
                // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮，待做

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


// 删除灵感
function delete_inspiration(id) {
    var datas = get_json({ "iid": id });
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/inspirer/delete"),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                go_next_page("inspiration.html");
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