$(document).ready(function() {
    initialize_page();
    get_experiences_list(1);

});


// 获取问题列表
function get_experiences_list(nums) {
    $.ajax({
        type: 'get',
        url: get_url("/getarticle?pagenum=" + nums),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_id = datas[i].uid;
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

                    c = '<div class="list-item" onclick="go_experience_details(' + experience_id + ')"   style="cursor:pointer;">' +
                        '<p class="list-item-title">' + experience_title + '</p>' +
                        '<div class="user-box">' +
                        '<div class="img-box">' +
                        '<img src="' + author_headpic + '" alt="" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;"/>' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</p>' +
                        ' </div>' +
                        '</div>' +
                        '<div class="infos">' +
                        '<div class="img-box">' +
                        '<img src="' + experience_imag_url + '" alt="" />' +
                        '</div>' +
                        '<div class="desc">' +
                        '<p class="desc-word">' + experience_content + '</p>' +
                        '<a href="javascript:go_experience_details(' + experience_id + ')" class="more">' +
                        '<label class="cf7">[...查看详情]</label>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="other">' +
                        '<span class="other-item date">' + experience_creattime + '</span>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-comment"></span>' +
                        '<span>' + experience_comments + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-open"></span>' +
                        '<span>' + experience_reading + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-user"></span>' +
                        '<span>' + experience_likes + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-heart"></span>' +
                        '<span>' + experience_collectons + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c;
                }
                $('#experience_list').html(content);

                // 分页相关
                $('#total').val(counts);
                compute_pagenum(nums, "get_experiences_list", -10000)

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

// 跳转到教程详情页面
function go_experience_details(aid) {
    window.location.href = "experience_detail.html?aid=" + aid;
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