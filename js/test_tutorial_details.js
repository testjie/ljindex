$(document).ready(function() {

    is_need_login();
    initialize_page();
    set_copyright_version();

    var tutorial_id = get_id();
    get_tutorial_detail(tutorial_id);
    get_comments_paging(tutorial_id, 0, 1) // 评论分页

    // 评论文章
    $("#tutorial_comments_btn").click(function() {

        is_need_login();
        var tutorial_comments_ctt = $('#tutorial_comments_ctt').val();
        is_content_not_null(tutorial_comments_ctt);

        var datas = get_json({ 'ctype': 0, 'comment': tutorial_comments_ctt, 'fid': tutorial_id })
        $.ajax({
            type: 'post',
            url: get_url("/comment/new"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    $('#tutorial_comments_ctt').val('');
                    get_comments_paging($('#tutorial_id').val(), 0, 1)
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
        var datas = get_json({ 'ctype': 0, 'status': user_like_status, 'gid': tutorial_id })
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
                        $('#tutorial_likes').text(Number($('#tutorial_likes').text()) + 1);
                        // 点赞失败
                    } else {
                        $("#user_likes").attr("style", "");
                        $('#tutorial_likes').text(Number($('#tutorial_likes').text()) - 1);
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
        var datas = get_json({ 'ctype': 0, 'status': user_like_status, 'cid': tutorial_id })
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
                    $('#tutorial_collectons').text(Number($('#tutorial_collectons').text()) + 1);
                    // 点赞失败
                } else {
                    $("#user_collectons").attr("style", "");
                    $('#tutorial_collectons').text(Number($('#tutorial_collectons').text()) - 1);
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
function get_tutorial_detail(id) {
    $.ajax({
        type: 'get',
        url: get_url("/get/coure?cid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic);
                var author_infomation = datas.userinfo;

                var tutorial_reading = 456; // 阅读量
                var tutorial_comments = 456; // 评论量
                var tutorial_likes = datas.goods; // 点赞数
                var tutorial_collectons = datas.collections; // 收藏量

                var tutorial_id = datas.id; // 文章id
                var tutorial_title = datas.title; // 标题
                var tutorial_creattime = datas.updatetime; // 创建时间
                var tutorial_content = datas.content; // 简介
                var tutorial_imag_url = get_img_url(datas.ximg); // 文章图片

                // $('#fengmianimg').attr("style", "background:url(" + tutorial_imag_url + ")  no-repeat center top;background-size:cover; ");
                $('#fengmianimg').attr("src", tutorial_imag_url);

                // 判断是否可以修改
                $('#author_name').text(author_name); // 作者名
                $('#author_infomation').text(author_infomation); // 个性签名
                $('#author_headpic').attr("src", author_headpic); //头像

                // 个人中心跳转
                // $('#author_name').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                // $('#author_name').attr("style", "cursor:pointer;"); //头像
                // $('#author_headpic').attr("onclick", "go_personal_center(" + author_id + ")"); //头像
                // $('#author_headpic').attr("style", "cursor:pointer;"); //头像

                $('#tutorial_title').text(tutorial_title); // 文章标题
                $('#tutorial_id').attr("value", tutorial_id); // 文章id
                $('#tutorial_content').html(tutorial_content); // 文章内容

                $('#tutorial_likes').text(tutorial_likes); // 评论数
                $('#tutorial_reading').text(tutorial_reading); // 评论数
                $('#tutorial_comments').text(tutorial_comments); // 评论数
                $('#tutorial_collectons').text(tutorial_collectons); // 评论数
                $('#tutorial_creattime').text(tutorial_creattime); // 创建时间

                // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮
                var user4_status = get_user4_status(0, tutorial_id);
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